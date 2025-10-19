const express = require('express')
const router = express.Router()
const Artist = require('../model/artistModel')
const Login = require('../model/loginModel')
const Appoinment = require('../model/appoinmentModel')

// Create or update artist (admin)
router.post('/', async (req, res) => {
    try {
        const { name, email, location, services, workImages } = req.body
        if (!name || !email || !location || !Array.isArray(services)) {
            return res.status(400).json({ error: 'Missing required fields' })
        }

        const update = { name, email, location, services, workImages: workImages || [] }
        const artist = await Artist.findOneAndUpdate({ email }, update, { upsert: true, new: true, setDefaultsOnInsert: true })
        res.status(201).json(artist)
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' })
    }
})

// List all artists (public)
router.get('/', async (_req, res) => {
    try {
        const artists = await Artist.find()
        res.json(artists)
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' })
    }
})

// Get artist by email
router.get('/by-email/:email', async (req, res) => {
    try {
        const email = decodeURIComponent(req.params.email)
        const artist = await Artist.findOne({ email })
        if (!artist) return res.status(404).json({ error: 'Artist not found' })
        res.json(artist)
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' })
    }
})

// Update artist services (replace services array)
router.patch('/:id/services', async (req, res) => {
    try {
        const { id } = req.params
        const { services } = req.body
        if (!Array.isArray(services)) return res.status(400).json({ error: 'Services must be an array' })
        const artist = await Artist.findByIdAndUpdate(id, { services }, { new: true })
        if (!artist) return res.status(404).json({ error: 'Artist not found' })
        res.json(artist)
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' })
    }
})

// Delete artist account
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const artist = await Artist.findByIdAndDelete(id)
        if (!artist) return res.status(404).json({ error: 'Artist not found' })

        // Also remove any login credential associated with this artist email
        try {
            await Login.findOneAndDelete({ email: artist.email })
        } catch (e) {
            // Log and continue
            console.warn('Failed to delete login for artist:', e)
        }

        // Optionally remove related appointments for this artist (cleanup)
        try {
            await Appoinment.deleteMany({ staff: artist.name })
        } catch (e) {
            console.warn('Failed to delete appointments for artist:', e)
        }

        res.json({ message: 'Artist and related records deleted' })
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' })
    }
})

module.exports = router


