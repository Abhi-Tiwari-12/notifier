const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');

const app = express();

app.use(cors({
    origin: 'https://tsc-notifier.netlify.app',
    methods: ['GET', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
}));

app.get('/api/sheet', async (req, res) => {
    try {
        const googleSheetUrl = 'https://script.google.com/macros/s/AKfycbxh-ffRKlvik_-H7-Jv4uuFAlN_68O6qIQYlZ0LJMkjZMZS9Y67O9BFIRGDavoE9vkq/exec';
        const response = await fetch(googleSheetUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            signal: AbortSignal.timeout(10000)
        });

        if (!response.ok) {
            throw new Error(`Google Sheets API error (status ${response.status})`);
        }

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error('Error proxying to Google Sheets API:', error);
        res.status(500).json({
            error: 'Failed to fetch data from Google Sheets',
            message: error.message
        });
    }
});

module.exports.handler = serverless(app);