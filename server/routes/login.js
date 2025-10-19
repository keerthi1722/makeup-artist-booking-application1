const express = require('express');
const router = express.Router();
const Login = require('../model/loginModel')

// Register Route
router.post('/register', async (req, res) => {
    const { fullname, email, password } = req.body;

    try {
        // Check if user already exists
        const userExists = await Login.findOne({ email });
        if (userExists) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Create a new user
        const user = new Login({ fullname, email, password });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists
        const user = await Login.findOne({ email });
        if (!user || user.password !== password) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Login successful
        res.status(200).json({ message: 'Login successful', user });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
