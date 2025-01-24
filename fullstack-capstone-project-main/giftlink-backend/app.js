/*jshint esversion: 8 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pinoLogger = require('./logger');

const connectToDatabase = require('./models/db');
const { loadData } = require('./util/import-mongo/index');

const app = express();
app.use('*', cors());
const port = 3060;

// Connect to MongoDB; we just do this one time
connectToDatabase()
    .then(() => {
        pinoLogger.info('Connected to DB');
    })
    .catch((e) => console.error('Failed to connect to DB', e));

app.use(express.json());

// Route files
// Gift API Task 1: import the giftRoutes and store in a constant called giftroutes
const giftRoutes = require('./routes/giftRoutes');

// Search API Task 1: import the searchRoutes and store in a constant called searchRoutes
const searchRoutes = require('./routes/searchRoutes');

// Auth API Task 1: import the authRoutes and store in a constant called authRoutes
const authRoutes = require('./routes/authRoutes');

const pinoHttp = require('pino-http');
const logger = require('./logger');

app.use(pinoHttp({ logger }));

// Use Routes
// Gift API Task 2: add the giftRoutes to the server by using the app.use() method.
app.use('/api/gifts', giftRoutes);

// Search API Task 2: add the searchRoutes to the server by using the app.use() method.
app.use('/api/search', searchRoutes);

// Auth API Task 2: add the authRoutes to the server by using the app.use() method.
app.use('/api/auth', authRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Error details:', err); // Log the error details for debugging

    // Check if the error has a status code
    if (err.status) {
        return res.status(err.status).json({
            error: {
                message: err.message || 'An error occurred',
                status: err.status,
            },
        });
    }

    // Handle specific error types
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            error: {
                message: err.message,
                status: 400,
            },
        });
    }

    // Default to 500 Internal Server Error
    res.status(500).json({
        error: {
            message: 'Internal Server Error',
            status: 500,
        },
    });
});
// Serve static files from the 'public' directory
app.use(express.static('public'));

// Route to serve the home page
app.get('/app', (req, res) => {
    res.sendFile(__dirname + '/public/home.html');
});

app.get('/', (req, res) => {
    res.send('Inside the server');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
