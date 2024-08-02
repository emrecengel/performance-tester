const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 3001;  // Make sure this doesn't conflict with your React app's port

app.use(cors());

app.get('/proxy', async (req, res) => {
    const url = req.query.url;
    if (!url) {
        return res.status(400).send('URL is required');
    }

    try {
        const startTime = Date.now();
        const response = await axios({
            url,
            method: req.method,
            headers: {
                ...req.headers,
                host: new URL(url).host,  // Set the correct host header
            },
            validateStatus: () => true,  // Don't throw on any status code
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
            stack: error.stack,
        });
    }
});

app.listen(port, () => {
    console.log(`Local proxy server running on http://localhost:${port}`);
});