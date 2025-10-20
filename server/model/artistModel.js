const mongoose = require('mongoose')

const artistSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    location: { type: String, required: true },
    services: [
        {
            name: { type: String, required: true },
            price: { type: Number, required: true }
        }
    ],
    workImages: [{ type: String }],
    ratingAverage: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 }
})

const Artist = mongoose.model('Artist', artistSchema)

module.exports = Artist


