const mongoose = require('mongoose')
require('dotenv').config();

const DB = process.env.DATABASE || 'mongodb://localhost:27017/salon-management'

const connectDB = async () => {
    try {
        await mongoose.connect(DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB connection successful");
    } catch (err) {
        console.error("MongoDB connection error:", err);
        // Continue without database for testing
        console.log("Continuing without database connection...");
    }
};

connectDB();