const express = require('express');
const router = express.Router();

// Assuming you have a Wages model for fetching wage data
const Wages = require('../model/wageModel'); // Update the path as needed

// GET route to fetch wages
router.get('/', async (req, res) => {
    try {
        const wages = await Wages.find(); // Fetch wages from the database
        res.json(wages); // Send the wages as JSON
    } catch (error) {
        res.status(500).json({ error: 'Error fetching wages' });
    }
});

module.exports = router;
