import React, { useState } from 'react';
import { Tabs, Tab, Box, Typography, Paper, useTheme } from '@mui/material';
import { Timeline as TimelineIcon, BarChart as BarChartIcon, PieChart as PieChartIcon, BubbleChart as BubbleChartIcon, TrendingUp as TrendingUpIcon } from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Scatter, ScatterChart, ZAxis, AreaChart, Area, ReferenceArea } from 'recharts';
import { DataUsage } from '@mui/icons-material';
import ChartContainer from "./ChartContainer";

const COLORS = {
    '1xx': '#2196f3', // Informational
    '2xx': '#4caf50', // Success
    '3xx': '#ff9800', // Redirection
    '4xx': '#f44336', // Client Error
    '5xx': '#9c27b0', // Server Error
};

const CustomTooltip = ({ active, payload, label, valueFormatter }) => {
    const theme = useTheme();
    if (active && payload && payload.length) {
        return (
            <Paper elevation={3} sx={{ p: 2, bgcolor: theme.palette.background.paper }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    {typeof label === 'number' ? new Date(label).toLocaleString() : label}
                </Typography>
                {payload.map((entry, index) => (
                    <Typography key={index} variant="body2" sx={{ color: entry.color }}>
                        {`${entry.name}: ${valueFormatter ? valueFormatter(entry.value, entry.name) : entry.value}`}
                    </Typography>
                ))}
            </Paper>
        );
    }
    return null;
};

const getStatusCodeCategory = (status) => {
    if (status < 200) return '1xx';
    if (status < 300) return '2xx';
    if (status < 400) return '3xx';
    if (status < 500) return '4xx';
    return '5xx';
};

const getStatusCodeDescription = (status) => {
    const categories = {
        '1xx': 'Informational',
        '2xx': 'Success',
        '3xx': 'Redirection',
        '4xx': 'Client Error',
        '5xx': 'Server Error',
    };
    return categories[getStatusCodeCategory(status)];
};

const PerformanceOverview = ({ results }) => {
    const [activeTab, setActiveTab] = useState(0);
    const theme = useTheme();

    const tabStyle = {
        minHeight: 72,
        fontWeight: 'bold',
        fontSize: '0.875rem',
        color: theme.palette.text.secondary,
        '&.Mui-selected': {
            color: theme.palette.primary.main,
        },
    };

    const chartProps = {
        height: 400,
        margin: { top: 20, right: 30, left: 20, bottom: 20 },
    };

    const valueFormatter = (value, name) => {
        if (typeof value === 'undefined' || value === null) {
            return 'N/A';
        }
        switch (name) {
            case 'Response Time':
            case 'TTFB':
                return `${typeof value === 'number' ? value.toFixed(2) : value} ms`;
            case 'Status Code':
                return `${value} (${getStatusCodeDescription(value)})`;
            case 'Content Length':
                return typeof value === 'number' ? `${value.toLocaleString()} bytes` : `${value} bytes`;
            case 'Count':
                return `${value} request${value !== 1 ? 's' : ''}`;
            default:
                return value.toString();
        }
    };

    const statusCodeData = Object.entries(
        results.reduce((acc, result) => {
            const category = getStatusCodeCategory(result.status);
            acc[category] = (acc[category] || 0) + 1;
            return acc;
        }, {})
    ).map(([category, count]) => ({ category, count }));

    return (
        <ChartContainer title="Performance Overview">
            <Tabs
                value={activeTab}
                onChange={(e, newValue) => setActiveTab(newValue)}
                variant="fullWidth"
                sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
            >
                <Tab icon={<TimelineIcon />} label="Response Time" sx={tabStyle} />
                <Tab icon={<BarChartIcon />} label="Status Codes" sx={tabStyle} />
                <Tab icon={<PieChartIcon />} label="Error Distribution" sx={tabStyle} />
                <Tab icon={<BubbleChartIcon />} label="Response Distribution" sx={tabStyle} />
                <Tab icon={<TrendingUpIcon />} label="Performance Trends" sx={tabStyle} />
            </Tabs>

            <Box height={400} sx={{ pb: 2 }}>
                {activeTab === 0 && (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={results} {...chartProps}>
                            <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                            <XAxis
                                dataKey="timestamp"
                                type="number"
                                domain={['dataMin', 'dataMax']}
                                tickFormatter={(unixTime) => new Date(unixTime).toLocaleTimeString()}
                                stroke={theme.palette.text.secondary}
                            />
                            <YAxis
                                yAxisId="left"
                                stroke={theme.palette.primary.main}
                                label={{ value: 'Time (ms)', angle: -90, position: 'insideLeft' }}
                            />
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                stroke={theme.palette.secondary.main}
                                label={{ value: 'Status Code', angle: 90, position: 'insideRight' }}
                                domain={[100, 599]}
                                allowDataOverflow={true}
                            />
                            <RechartsTooltip
                                content={<CustomTooltip
                                    valueFormatter={(value, name) => {
                                        if (name === 'Status Code') {
                                            return `${value} (${getStatusCodeDescription(value)})`;
                                        }
                                        return valueFormatter(value, name);
                                    }}
                                />}
                            />
                            <Legend />
                            <Line
                                yAxisId="left"
                                type="monotone"
                                dataKey="responseTime"
                                stroke={theme.palette.primary.main}
                                strokeWidth={2}
                                dot={false}
                                name="Response Time"
                            />
                            <Line
                                yAxisId="left"
                                type="monotone"
                                dataKey="ttfb"
                                stroke={theme.palette.secondary.main}
                                strokeWidth={2}
                                dot={false}
                                name="TTFB"
                            />
                            {Object.keys(COLORS).map((category) => (
                                <Line
                                    key={category}
                                    yAxisId="right"

                                    type="step"
                                    dataKey={(data) => getStatusCodeCategory(data.status) === category ? data.status : null}
                                    stroke={COLORS[category]}
                                    strokeWidth={2}
                                    dot={{ r: 4, strokeWidth: 1 }}
                                    name={`${category} Status`}
                                    connectNulls={true}
                                />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                )}

                {activeTab === 1 && (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={statusCodeData} {...chartProps}>
                            <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                            <XAxis dataKey="category" stroke={theme.palette.text.secondary} />
                            <YAxis allowDecimals={false} stroke={theme.palette.text.secondary} />
                            <RechartsTooltip
                                content={<CustomTooltip
                                    valueFormatter={(value, name) => {
                                        if (name === 'Count') return `${value} request${value !== 1 ? 's' : ''}`;
                                        return `${name}: ${getStatusCodeDescription(name.split('x')[0] + '00')}`;
                                    }}
                                />}
                            />
                            <Legend />
                            <Bar dataKey="count" name="Count">
                                {statusCodeData.map((entry) => (
                                    <Cell key={`cell-${entry.category}`} fill={COLORS[entry.category]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                )}

                {activeTab === 2 && (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart {...chartProps}>
                            <Pie
                                data={Object.entries(results.reduce((acc, result) => {
                                    if (result.error) {
                                        acc[result.error.name] = (acc[result.error.name] || 0) + 1;
                                    }
                                    return acc;
                                }, {})).map(([name, value]) => ({ name, value }))}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={150}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {Object.entries(results.reduce((acc, result) => {
                                    if (result.error) {
                                        acc[result.error.name] = (acc[result.error.name] || 0) + 1;
                                    }
                                    return acc;
                                }, {})).map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={Object.values(COLORS)[index % Object.values(COLORS).length]} />
                                ))}
                            </Pie>
                            <RechartsTooltip content={<CustomTooltip valueFormatter={valueFormatter} />} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                )}

                {activeTab === 3 && (
                    <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart {...chartProps}>
                            <CartesianGrid stroke={theme.palette.divider} />
                            <XAxis
                                type="number"
                                dataKey="responseTime"
                                name="Response Time"
                                unit="ms"
                                stroke={theme.palette.text.secondary}
                                label={{ value: 'Response Time (ms)', position: 'bottom' }}
                            />
                            <YAxis
                                type="number"
                                dataKey="status"
                                name="Status Code"
                                stroke={theme.palette.text.secondary}
                                label={{ value: 'Status Code', angle: -90, position: 'insideLeft' }}
                                domain={[0, 599]}
                                ticks={[0, 100, 200, 300, 400, 500]}
                            />
                            <ZAxis
                                type="number"
                                dataKey="contentLength"
                                range={[10, 1000]}
                                name="Content Length"
                                unit="bytes"
                            />
                            <RechartsTooltip
                                content={<CustomTooltip
                                    valueFormatter={(value, name) => {
                                        if (name === 'Status Code') {
                                            return `${value} (${getStatusCodeDescription(value)})`;
                                        }
                                        return valueFormatter(value, name);
                                    }}
                                />}
                            />
                            <Legend />
                            {Object.entries(COLORS).map(([category, color]) => (
                                <Scatter
                                    key={category}
                                    name={`${category} Status`}
                                    data={results.filter(result => getStatusCodeCategory(result.status) === category)}
                                    fill={color}
                                />
                            ))}
                            {Object.entries(COLORS).map(([category, color], index) => (
                                <ReferenceArea
                                    key={category}
                                    y1={(index * 100) + 100}
                                    y2={(index * 100) + 199}
                                    stroke="none"
                                    fill={color}
                                    fillOpacity={0.1}
                                />
                            ))}
                        </ScatterChart>
                    </ResponsiveContainer>
                )}

                {activeTab === 4 && (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={results} {...chartProps}>
                            <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                            <XAxis
                                dataKey="timestamp"
                                tickFormatter={(unixTime) => new Date(unixTime).toLocaleTimeString()}
                                stroke={theme.palette.text.secondary}
                            />
                            <YAxis
                                stroke={theme.palette.text.secondary}
                                label={{ value: 'Time (ms)', angle: -90, position: 'insideLeft' }}
                            />
                            <RechartsTooltip content={<CustomTooltip valueFormatter={valueFormatter} />} />
                            <Legend />
                            <Area
                                type="monotone"
                                dataKey="responseTime"
                                name="Response Time"
                                stroke={theme.palette.primary.main}
                                fill={theme.palette.primary.light}
                                fillOpacity={0.3}
                            />
                            <Area
                                type="monotone"
                                dataKey="ttfb"
                                name="TTFB"
                                stroke={theme.palette.secondary.main}
                                fill={theme.palette.secondary.light}
                                fillOpacity={0.3}
                            />
                            <Area
                                type="monotone"
                                dataKey="contentLength"
                                name="Content Length"
                                stroke={theme.palette.info.main}
                                fill={theme.palette.info.light}
                                fillOpacity={0.3}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                )}
            </Box>
        </ChartContainer>
    );
};

export default PerformanceOverview;