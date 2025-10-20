const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const sleep = promisify(setTimeout);

const Appoinment = require('../model/appoinmentModel');
const Wage = require('../model/wageModel');

const { sendMail } = require('../controllers/sendMail');
const { generateInvoice } = require('../controllers/easyInvoice');

// Ensure invoices folder exists
const invoicesDir = path.join(__dirname, '../invoices');
if (!fs.existsSync(invoicesDir)) fs.mkdirSync(invoicesDir, { recursive: true });

// List all booked dates (for date disabling)
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

// List all appointments
router.get('/', async (req, res) => {
    try {
        const appointments = await Appoinment.find().sort({ date: -1 });
        res.json(appointments);
    } catch (err) {
        console.error('Error fetching appointments:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete appointment
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const appointment = await Appoinment.findByIdAndDelete(id);
        if (!appointment) return res.status(404).json({ error: 'Appointment not found' });
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
        // Normalize subservices
        const subServicesArray = Array.isArray(selectedSubServices) ? selectedSubServices : (selectedSubServices ? [selectedSubServices] : []);
        const formattedSubServices = subServicesArray.map(subService => {
            if (typeof subService === 'string') {
                const [sname, price] = subService.split(':');
                return { name: sname?.trim() || '', price: parseFloat(price) || 0 };
            }
            return { name: String(subService), price: 0 };
        });

        // Normalize services
        const normalizedServices = Array.isArray(selectedServices) ? selectedServices : (selectedServices ? [selectedServices] : []);
        const parsedTotalPrice = Number(String(totalPrice || 0).replace(/[^0-9.-]+/g, '')) || 0;

        // Save appointment
        const user = new Appoinment({
            name,
            email,
            selectedServices: normalizedServices,
            selectedSubServices: formattedSubServices,
            staff,
            date: new Date(date),
            address: address || '',
            totalPrice: parsedTotalPrice
        });
        await user.save();

        // Save wage
        const wageAmount = parsedTotalPrice * 0.5;
        const wage = new Wage({
            staffName: staff,
            clientName: name,
            service: normalizedServices,
            subServices: formattedSubServices,
            date: new Date(date),
            clientAddress: address || '',
            totalPrice: parsedTotalPrice,
            wage: wageAmount
        });
        await wage.save();
        console.log("Wage saved:", wage);

        // Sanitize filename
        const safeName = name.replace(/[^a-z0-9]/gi, '_');
        const filePath = path.join(invoicesDir, `invoice_${Date.now()}_${safeName}.pdf`);

        // Generate invoice and send emails
        try {
            await generateInvoice(name, [{ name: normalizedServices, selectedSubServices: formattedSubServices, staff, price: parsedTotalPrice }], filePath);
            await sleep(1000);

            // Send to client
            try {
                await sendMail(email, "Appointment Confirmation",
                    `${name}, your appointment is booked on ${date} for service ${JSON.stringify(formattedSubServices)}.`,
                    `<p>${name}, your appointment is booked on ${date} for service ${JSON.stringify(formattedSubServices)}.</p>`,
                    filePath
                );
            } catch (mailErr) {
                console.error('Failed to send appointment email to client:', mailErr);
            }

            // Notify artist/staff
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

        // Delete invoice file safely
        try {
            await fs.promises.unlink(filePath);
        } catch (err) {
            console.error(`Failed to delete invoice file: ${filePath}`, err);
        }

    } catch (err) {
        console.error("Appointment creation error:", err);
        res.status(500).json({ error: "Internal server error", details: err.message });
    }
});

// Accept appointment
router.patch('/:id/accept', async (req, res) => {
    try {
        const { id } = req.params;
        const appt = await Appoinment.findByIdAndUpdate(id, { status: 'accepted' }, { new: true });
        if (!appt) return res.status(404).json({ error: 'Appointment not found' });
        res.json(appt);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Reject appointment
router.patch('/:id/reject', async (req, res) => {
    try {
        const { id } = req.params;
        const appt = await Appoinment.findByIdAndUpdate(id, { status: 'rejected' }, { new: true });
        if (!appt) return res.status(404).json({ error: 'Appointment not found' });
        res.json(appt);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// List by staff
router.get('/by-staff/:name', async (req, res) => {
    try {
        const list = await Appoinment.find({ staff: req.params.name }).sort({ date: -1 });
        res.json(list);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// List by user email
router.get('/by-user/:email', async (req, res) => {
    try {
        const list = await Appoinment.find({ email: req.params.email }).sort({ date: -1 });
        res.json(list);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
