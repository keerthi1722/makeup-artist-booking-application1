const express = require('express');
const router = express.Router();
const Login = require('../model/loginModel')

// Register Route
router.post('/register', async (req, res) => {
    const { fullname, email, password } = req.body;

    try {
        console.log('Register attempt for:', email);
        // Check if user already exists
        const userExists = await Login.findOne({ email });
        if (userExists) {
            console.log('Register failed - user exists:', email);
            return res.status(400).json({ error: 'User already exists' });
        }

        // Create a new user
        const user = new Login({ fullname, email, password });
        await user.save();
        console.log('User registered:', email);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('Register error for', email, err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log('Login attempt for:', email);
        // Check if the user exists
        const user = await Login.findOne({ email });
        console.log('User lookup result for', email, !!user);
        if (!user || user.password !== password) {
            console.log('Login failed for:', email);
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Login successful
        console.log('Login successful for:', email);
        res.status(200).json({ message: 'Login successful', user });
    } catch (err) {
        console.error('Login error for', email, err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
