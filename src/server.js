const express = require('express');
const axios = require('axios');
const cors = require('cors');
const https = require('https');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());

const axiosInstance = axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
});

app.get('/proxy', async (req, res) => {
    const url = req.query.url;
    if (!url) {
        return res.status(400).send('URL is required');
    }

    try {
        const startTime = Date.now();
        const response = await axiosInstance({
            url,
            method: req.method,
            headers: {
                ...req.headers,
                host: new URL(url).host,
            },
            validateStatus: () => true,
            timeout: 30000,
        });

        const ttfb = Date.now() - startTime;

        res.status(response.status).send({
            url,
            responseTime: Date.now() - startTime,
            status: response.status,
            contentLength: response.headers['content-length'] || 'N/A',
            ttfb,
            data: response.data,
            headers: response.headers,
        });
    } catch (error) {
        console.error('Proxy error:', error.message);
        res.status(500).send({
            url,
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        });
    }
});

app.listen(port, () => {
    console.log(`Proxy server running on http://localhost:${port}`);
});