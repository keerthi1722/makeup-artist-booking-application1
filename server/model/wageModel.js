const mongoose = require('mongoose');

const wageSchema = new mongoose.Schema({
    staffName: { type: String, required: true },
    clientName: { type: String, required: true },
    service: [{ type: String, required: true }], // Change service to an array of strings
    subServices: [{
        name: String,
        price: Number
    }],
    date: { type: Date, required: true },
    totalPrice: { type: Number, required: true },
    wage: { type: Number, required: true }
});


const Wage = mongoose.model('Wage', wageSchema);
module.exports = Wage;
