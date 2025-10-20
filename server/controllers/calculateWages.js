const Appoinment = require('../model/appoinmentModel');

async function calculateWages(staffName) {
    try {
        // Fetch all appointments for the given staff member
        const appointments = await Appoinment.find({ staff: staffName });

        if (appointments.length === 0) {
            return { message: "No appointments found for this staff member" };
        }

        // Calculate the total wage
        let totalWages = 0;
        appointments.forEach(appointment => {
            totalWages += appointment.totalPrice * 0.5; // Assuming 50% of total price as wage
        });

        return { staffName, totalWages };
    } catch (err) {
        console.log(err);
        throw new Error("Error calculating wages");
    }
}

module.exports = { calculateWages };
