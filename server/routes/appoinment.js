const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs'); // Import fs module
const { promisify } = require('util');
const sleep = promisify(setTimeout);

// require('../db/conn')
const Appoinment = require('../model/appoinmentModel');
const Wage = require('../model/wageModel'); // Adjust the path if needed

const { sendMail } = require('../controllers/sendMail');
const { generateInvoice } = require('../controllers/easyInvoice');

// List all appointments (admin)
// For date disabling in client
router.get('/booked-dates', async (req, res) => {
    try {
        const appointments = await Appoinment.find({}, 'date');
        const bookedDates = appointments.map(a => new Date(a.date).toISOString().split('T')[0]);
        res.json({ bookedDates });
    } catch (err) {
        console.error('Error fetching booked dates:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// List all appointments (admin)
router.get('/', async (req, res) => {
    try {
        const appointments = await Appoinment.find().sort({ date: -1 });
        res.json(appointments);
    } catch (err) {
        console.error('Error fetching appointments:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete appointment route
// Delete single appointment (admin)
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const appointment = await Appoinment.findByIdAndDelete(id);
        
        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }
        
        res.json({ message: 'Appointment deleted successfully' });
    } catch (err) {
        console.error('Error deleting appointment:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create appointment
router.post('/', async (req, res) => {
    console.log("Appointment request received:", req.body);
    const { name, email, selectedServices, selectedSubServices, staff, date, totalPrice, address } = req.body;

    if (!name || !email || !selectedServices || !staff || !date) {
        console.log("Validation failed - missing required fields");
        return res.status(422).json({ error: "Please fill all the details" });
    }

    try {
        // allow multiple appointments per email (users may book again)
        // Normalize inputs to safe defaults
        const subServicesArray = Array.isArray(selectedSubServices) ? selectedSubServices : (selectedSubServices ? [selectedSubServices] : []);
        const formattedSubServices = subServicesArray.map(subService => {
            // subService expected as 'Name:price' string
            if (typeof subService !== 'string') return { name: String(subService), price: 0 };
            const [sname, price] = subService.split(':');
            return { name: sname || '', price: parseFloat(price) || 0 };
        });

        const normalizedServices = Array.isArray(selectedServices) ? selectedServices : (selectedServices ? [selectedServices] : []);
        const parsedTotalPrice = Number(String(totalPrice || 0).replace(/[^0-9.-]+/g, '')) || 0;

        const user = new Appoinment({
            name,
            email,
            selectedServices: normalizedServices,
            selectedSubServices: formattedSubServices,
            staff,
            date,
            address: address || '',
            totalPrice: parsedTotalPrice
        });

        await user.save();

        const wageAmount = parsedTotalPrice * 0.5;

        // Save wage details for the staff
        const wage = new Wage({
            staffName: staff,
            clientName: name,
            service: Array.isArray(selectedServices) ? selectedServices : [selectedServices], // Ensure it's always an array
            subServices: formattedSubServices,
            date,
            clientAddress: address || '',
            totalPrice: parsedTotalPrice,
            wage: wageAmount
        });
        await wage.save();
        console.log("Wage saved:", wage);


        // Define the file path correctly
        const filePath = path.join(__dirname, `../invoices/invoice_${Date.now()}_${name.replace(/\s+/g, '_')}.pdf`);
        console.log(`Attempting to read file at: ${filePath}`);

        
        // Try to generate invoice and send emails, but don't fail the entire request if they error
        try {
            // Generate the invoice (best-effort)
            await generateInvoice(name, [{ name: normalizedServices, selectedSubServices: formattedSubServices, staff: staff, price: parsedTotalPrice }], filePath);

            await sleep(1000);

            // Send the email to client with the invoice (best-effort)
            try {
                await sendMail(email, "Appointment Confirmation",
                    `${name}, your appointment is booked on ${date} for service ${JSON.stringify(formattedSubServices)}.`,
                    `<p>${name}, your appointment is booked on ${date} for service ${JSON.stringify(formattedSubServices)}.</p>`,
                    filePath
                );
            } catch (mailErr) {
                console.error('Failed to send appointment email to client:', mailErr);
            }

            // Notify the artist (without attachment)
            try {
                await sendMail(process.env.ARTIST_NOTIFY_EMAIL || process.env.EMAIL, "New Booking Request",
                    `New booking for ${staff} by ${name} on ${date}. Services: ${JSON.stringify(formattedSubServices)}. Total: ${parsedTotalPrice}`,
                    `<p>New booking for <b>${staff}</b> by <b>${name}</b> on <b>${date}</b>.<br/>Services: ${JSON.stringify(formattedSubServices)}.<br/>Total: ₹${parsedTotalPrice}</p>`
                );
            } catch (notifyErr) {
                console.error('Failed to notify artist email:', notifyErr);
            }
        } catch (errInvoice) {
            console.error('Invoice generation / email sending error (non-fatal):', errInvoice);
        }

        res.status(201).json({ message: "Appointment booked (email/invoice sent if available)" });

        // Optionally, delete the invoice file after sending
       

       


        fs.unlink(filePath, (err) => {
            if (err) console.error(`Failed to delete file: ${filePath}`, err);
        });

    } catch (err) {
        console.error("Appointment creation error:", err);
        res.status(500).json({ error: "Internal server error", details: err.message });
    }
});

// Accept appointment
router.patch('/:id/accept', async (req, res) => {
    try {
        const { id } = req.params
        const appt = await Appoinment.findByIdAndUpdate(id, { status: 'accepted' }, { new: true })
        if (!appt) return res.status(404).json({ error: 'Appointment not found' })
        res.json(appt)
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' })
    }
})

// Reject appointment
router.patch('/:id/reject', async (req, res) => {
    try {
        const { id } = req.params
        const appt = await Appoinment.findByIdAndUpdate(id, { status: 'rejected' }, { new: true })
        if (!appt) return res.status(404).json({ error: 'Appointment not found' })
        res.json(appt)
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' })
    }
})

// List by artist (staff)
router.get('/by-staff/:name', async (req, res) => {
    try {
        const list = await Appoinment.find({ staff: req.params.name }).sort({ date: -1 })
        res.json(list)
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' })
    }
})

// List by user email
router.get('/by-user/:email', async (req, res) => {
    try {
        const list = await Appoinment.find({ email: req.params.email }).sort({ date: -1 })
        res.json(list)
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' })
    }
})

module.exports = router;
