import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import ChartContainer from './ChartContainer';
import useTestState from '../hooks/useTestState';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const ResponseTimePercentiles = () => {
    const { stats } = useTestState();

    useEffect(() => {
        console.log('Stats in ResponseTimePercentiles:', stats);
    }, [stats]);

    const data = stats.percentiles ? [
        { name: '50th', value: stats.percentiles.p50 },
        { name: '90th', value: stats.percentiles.p90 },
        { name: '95th', value: stats.percentiles.p95 },
        { name: '99th', value: stats.percentiles.p99 },
    ] : [];

    useEffect(() => {
        console.log('Percentile data:', data);
    }, [data]);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{ backgroundColor: 'white', padding: '5px', border: '1px solid #ccc' }}>
                    <p>{`${label} percentile: ${payload[0].value.toFixed(2)} ms`}</p>
                </div>
            );
        }
        return null;
    };

    if (!stats.percentiles || Object.values(stats.percentiles).every(v => v === 0)) {
        return (
            <ChartContainer title="Response Time Percentiles">
                <Typography align="center">No percentile data available yet. Run a test to see results.</Typography>
            </ChartContainer>
        );
    }

    return (
        <ChartContainer title="Response Time Percentiles">
            <Box height={300}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar dataKey="value" fill="#8884d8" name="Response Time (ms)">
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </Box>
        </ChartContainer>
    );
};

export default ResponseTimePercentiles;