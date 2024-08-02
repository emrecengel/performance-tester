import axios from 'axios';
import Papa from 'papaparse';

export const parseCsv = (csvContent) => {
    const parsedData = Papa.parse(csvContent, {
        header: true,
        skipEmptyLines: true,
        transformHeader: header => header.trim()
    });

    if (parsedData.errors.length > 0) {
        console.error("CSV parsing errors:", parsedData.errors);
        throw new Error("Error parsing CSV data");
    }

    return parsedData.data.filter(row => row.URL && row.URL.trim() !== '');
};

export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const makeRequest = async (url, method = 'GET', headers = {}) => {
    const startTime = Date.now();
    try {
        const response = await axios({
            url: `http://localhost:3001/proxy?url=${encodeURIComponent(url)}`,
            method,
            headers,
            timeout: 30000,
        });

        const endTime = Date.now();
        const responseTime = endTime - startTime;

        return {
            url,
            responseTime,
            status: response.data.status,
            contentLength: response.data.contentLength,
            ttfb: response.data.ttfb,
            timestamp: endTime,
        };
    } catch (error) {
        const endTime = Date.now();
        const responseTime = endTime - startTime;

        let errorDetails = {
            name: error.name,
            message: error.message,
            code: error.code || 'UNKNOWN_ERROR'
        };

        if (axios.isAxiosError(error)) {
            if (error.response) {
                errorDetails = {
                    ...errorDetails,
                    status: error.response.status,
                    data: error.response.data
                };
            } else if (error.request) {
                errorDetails.message = 'No response received from the server';
            }
        }

        return {
            url,
            responseTime,
            status: errorDetails.status || 'N/A',
            contentLength: 'N/A',
            ttfb: 'N/A',
            error: errorDetails,
            timestamp: endTime,
        };
    }
};