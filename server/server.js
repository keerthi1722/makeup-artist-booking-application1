const express = require('express')
const app = express()
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const cors = require('cors');
require('dotenv').config();

const port = process.env.PORT || 5000 





// CORS origins can be configured via environment variable (comma-separated)
// Include the deployed frontend URL so the server accepts requests from the Vercel client by default
const defaultOrigins = ['http://localhost:5173', 'http://localhost:5174', 'https://makeup-artist-booking-application1.vercel.app']
const envOrigins = process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',').map(s => s.trim()) : []
const allowedOrigins = envOrigins.length > 0 ? envOrigins : defaultOrigins

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true)
        }
        return callback(new Error('Not allowed by CORS'))
    },
    methods: 'GET,POST,PUT,DELETE,PATCH,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
}));

 app.use(express.json());

// Connect to database
require('./db/conn')

// Load environment variables
dotenv.config({path:'./config.env'});

// Middleware
const middleware = (req,res,next)=>{
    console.log("Request received:", req.method, req.url);
    next();
}

app.use(middleware);

// Routes
app.use('/appoinment', require('./routes/appoinment'));
app.use('/login', require('./routes/login'));
app.use('/wages', require('./routes/wages'));
app.use('/userappoinment', require('./routes/userappoinment'));
app.use('/artists', require('./routes/artist'));

// Health check route
app.get('/', (req, res) => {
    res.json({ message: "Salon Management System API is running!" });
});




app.listen(port,()=>{
    console.log(`server running on ${port}`);
})