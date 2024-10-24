const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const potteryRoutes = require('./routes/potteryRoutes');

const app = express();

// Connect to MongoDB
connectDB();

// Enable CORS for all routes
app.use(cors({
    origin: 'http://localhost:3000', // Allow requests from your frontend
    methods: ['GET', 'POST', 'PUT'], // Specify allowed methods
    allowedHeaders: ['Content-Type'], // Specify allowed headers
}));

// Middleware to handle JSON body requests
app.use(express.json());

// Serve static files from the "uploads" directory
app.use('/uploads', express.static('uploads'));

// Use pottery routes
app.use('/api/pottery', potteryRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
