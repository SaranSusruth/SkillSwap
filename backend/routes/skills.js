const express = require('express');
const router = express.Router();
const {
    createSkill,
    getAllSkills,
    getSkillById,
    updateSkill,
    deleteSkill,
    getSkillsByUser,
} = require('../controllers/skillController');
const authenticate = require('../middleware/auth');
const { validateSkill } = require('../middleware/validation');

// Public Routes
router.get('/', getAllSkills);
router.get('/user/:userId', getSkillsByUser);
router.get('/:id', getSkillById);

// Protected Routes
router.post('/', authenticate, validateSkill, createSkill);
router.put('/:id', authenticate, updateSkill);
router.delete('/:id', authenticate, deleteSkill);

module.exports = router;
