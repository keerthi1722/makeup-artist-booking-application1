const express = require('express');
const router = express.Router();
const Appointment = require('../model/appoinmentModel');
const { sendMail } = require('../controllers/sendMail');

router.post('/', async (req, res) => {
    const { name, email, selectedServices, selectedSubServices, staff, date, totalPrice } = req.body;

    if (!name || !email || !selectedServices || !staff || !date) {
        return res.status(422).json({ error: "Please fill all the details" });
    }

    try {
        const userExist = await Appointment.findOne({ email: email });

        if (userExist) {
            return res.status(422).json({ error: "Appointment already exists for this email" });
        }

        const formattedSubServices = selectedSubServices.map(subService => {
            const [name, price] = subService.split(':');
            return { name, price: parseFloat(price) };
        });

        const user = new Appointment({
            name,
            email,
            selectedServices: Array.isArray(selectedServices) ? selectedServices : [selectedServices],
            selectedSubServices: formattedSubServices,
            staff,
            date,
            totalPrice
        });

        await user.save();

        // Send confirmation email without PDF
        await sendMail(email, "Appointment Confirmation",
            `${name}, your appointment is booked on ${date} for services: ${selectedSubServices}.`,
            `<p>${name}, your appointment is booked on ${date} for services: ${selectedSubServices}.</p>`
        );

        res.status(201).json({ message: "Appointment booked successfully" });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
