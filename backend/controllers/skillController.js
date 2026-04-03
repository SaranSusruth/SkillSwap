const Skill = require('../models/Skill');
const User = require('../models/User');

// Create Skill
exports.createSkill = async (req, res) => {
    try {
        const { name, description, category, level, tags } = req.body;

        const skill = new Skill({
            name,
            description,
            category: category || 'other',
            level: level || 'beginner',
            userId: req.user.id,
            tags: tags || [],
        });

        await skill.save();

        // Add skill to user's skills array
        await User.findByIdAndUpdate(
            req.user.id,
            { $push: { skills: { skillId: skill._id, level } } },
            { new: true }
        );

        res.status(201).json({
            message: 'Skill created successfully',
            skill,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get All Skills
exports.getAllSkills = async (req, res) => {
    try {
        const { category, level, search } = req.query;

        let filter = { isActive: true };

        if (category) filter.category = category;
        if (level) filter.level = level;
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }

        const skills = await Skill.find(filter).populate('userId', 'name profileImage rating');

        res.status(200).json({
            count: skills.length,
            skills,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get Skill by ID
exports.getSkillById = async (req, res) => {
    try {
        const skill = await Skill.findById(req.params.id).populate('userId', 'name email profileImage rating');

        if (!skill) {
            return res.status(404).json({ error: 'Skill not found' });
        }

        res.status(200).json({ skill });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update Skill
exports.updateSkill = async (req, res) => {
    try {
        let skill = await Skill.findById(req.params.id);

        if (!skill) {
            return res.status(404).json({ error: 'Skill not found' });
        }

        // Check if user is skill owner
        if (skill.userId.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized to update this skill' });
        }

        const { name, description, category, level, tags } = req.body;

        if (name) skill.name = name;
        if (description) skill.description = description;
        if (category) skill.category = category;
        if (level) skill.level = level;
        if (tags) skill.tags = tags;

        await skill.save();

        res.status(200).json({
            message: 'Skill updated successfully',
            skill,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete Skill
exports.deleteSkill = async (req, res) => {
    try {
        const skill = await Skill.findById(req.params.id);

        if (!skill) {
            return res.status(404).json({ error: 'Skill not found' });
        }

        // Check if user is skill owner
        if (skill.userId.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized to delete this skill' });
        }

        await Skill.findByIdAndDelete(req.params.id);

        // Remove from user's skills
        await User.findByIdAndUpdate(
            req.user.id,
            { $pull: { skills: { skillId: req.params.id } } }
        );

        res.status(200).json({ message: 'Skill deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get Skills by User
exports.getSkillsByUser = async (req, res) => {
    try {
        const skills = await Skill.find({ userId: req.params.userId, isActive: true });

        res.status(200).json({
            count: skills.length,
            skills,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
