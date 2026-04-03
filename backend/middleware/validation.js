const validateEmail = (email) => {
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return regex.test(email);
};

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

const validateRegister = (req, res, next) => {
    const { name, password, confirmPassword } = req.body;
    const email = normalizeEmail(req.body.email);

    if (!name || !email || !password || !confirmPassword) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    if (!validateEmail(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ error: 'Passwords do not match' });
    }

    req.body.email = email;

    next();
};

const validateLogin = (req, res, next) => {
    const { password } = req.body;
    const email = normalizeEmail(req.body.email);

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    if (!validateEmail(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    req.body.email = email;

    next();
};

const validateSkill = (req, res, next) => {
    const { name, description, category } = req.body;

    if (!name || !description) {
        return res.status(400).json({ error: 'Skill name and description are required' });
    }

    if (name.length < 3) {
        return res.status(400).json({ error: 'Skill name must be at least 3 characters' });
    }

    next();
};

module.exports = { validateEmail, validateRegister, validateLogin, validateSkill };
