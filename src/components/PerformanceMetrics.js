import React, { useMemo, useState } from 'react';
import { Grid, Typography, Box, Paper, Divider, useTheme, useMediaQuery, Tooltip, IconButton, Collapse } from '@mui/material';
import { Storage as StorageIcon, CheckCircle as CheckCircleIcon, Error as ErrorIcon, AccessTime as AccessTimeIcon, Speed as SpeedIcon, Memory as MemoryIcon, TrendingUp as TrendingUpIcon, Timeline as TimelineIcon, ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import StatCard from './StatCard';
import ErrorsSection from './ErrorsSection';

const PerformanceMetrics = ({ stats, results }) => {
    const theme = useTheme();
    const [expandedSections, setExpandedSections] = useState({
        requestOverview: true,
        performanceIndicators: true,
        advancedMetrics: true,
        responseTimePercentiles: true
    });

    const toggleSection = (section) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const getPerformanceGrade = useMemo(() => (avgResponseTime) => {
        if (!avgResponseTime) return { grade: 'N/A', color: theme.palette.grey[500] };
        if (avgResponseTime < 100) return { grade: 'A', color: theme.palette.success.main };
        if (avgResponseTime < 300) return { grade: 'B', color: theme.palette.success.light };
        if (avgResponseTime < 500) return { grade: 'C', color: theme.palette.warning.main };
        if (avgResponseTime < 1000) return { grade: 'D', color: theme.palette.warning.dark };
        return { grade: 'F', color: theme.palette.error.main };
    }, [theme]);

    const calculateSLA = useMemo(() => (results) => {
        if (!results || results.length === 0) return 0;
        const totalRequests = results.length;
        const successfulRequests = results.filter(r => r.status === 200).length;
        return (successfulRequests / totalRequests) * 100;
    }, []);

    const calculateApdex = useMemo(() => (results, targetTime = 500) => {
        const successfulResults = results.filter(r => r.status === 200);
        if (!successfulResults || successfulResults.length === 0) return 0;
        const satisfiedCount = successfulResults.filter(r => r.responseTime <= targetTime).length;
        const toleratingCount = successfulResults.filter(r => r.responseTime > targetTime && r.responseTime <= targetTime * 4).length;
        return (satisfiedCount + toleratingCount / 2) / successfulResults.length;
    }, []);

    const calculateAvgResponseTime = useMemo(() => (results) => {
        const successfulResults = results.filter(r => r.status === 200);
        if (!successfulResults || successfulResults.length === 0) return 0;
        const totalResponseTime = successfulResults.reduce((sum, r) => sum + r.responseTime, 0);
        return totalResponseTime / successfulResults.length;
    }, []);

    const calculatePercentiles = useMemo(() => (results) => {
        const successfulResponseTimes = results.filter(r => r.status === 200).map(r => r.responseTime).sort((a, b) => a - b);
        if (successfulResponseTimes.length === 0) return { p50: 0, p90: 0, p95: 0, p99: 0 };

        const getPercentile = (p) => {
            const index = Math.ceil((p / 100) * successfulResponseTimes.length) - 1;
            return successfulResponseTimes[index];
        };

        return {
            p50: getPercentile(50),
            p90: getPercentile(90),
            p95: getPercentile(95),
            p99: getPercentile(99)
        };
    }, []);

    const MetricSection = ({ title, children, id }) => (
        <Paper elevation={3} sx={{ mb: 3, p: 2, borderRadius: 2, boxShadow: theme.shadows[3] }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                    {title}
                </Typography>
                <Tooltip title={expandedSections[id] ? "Collapse" : "Expand"}>
                    <IconButton onClick={() => toggleSection(id)} size="small">
                        <ExpandMoreIcon sx={{ transform: expandedSections[id] ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.3s' }} />
                    </IconButton>
                </Tooltip>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Collapse in={expandedSections[id]}>
                <Grid container spacing={2}>
                    {children}
                </Grid>
            </Collapse>
        </Paper>
    );

    const memoizedMetrics = useMemo(() => {
        const errors = results.filter(result => result.error);
        const successfulResults = results.filter(r => r.status === 200);
        const avgResponseTime = calculateAvgResponseTime(results);
        const percentiles = calculatePercentiles(results);

        return {
            errors,
            successfulResults,
            avgResponseTime,
            percentiles,
            sla: calculateSLA(results),
            apdex: calculateApdex(results),
            performanceGrade: getPerformanceGrade(avgResponseTime),
            minResponse: Math.min(...successfulResults.map(r => r.responseTime)) || 0,
            maxResponse: Math.max(...successfulResults.map(r => r.responseTime)) || 0
        };
    }, [results, calculateAvgResponseTime, calculatePercentiles, calculateSLA, calculateApdex, getPerformanceGrade]);

    return (
        <Box sx={{ p: 3, backgroundColor: theme.palette.background.default }}>
            <MetricSection title="Request Overview" id="requestOverview">
                <Grid item xs={6} sm={3}>
                    <StatCard
                        title="Total Requests"
                        value={results.length}
                        icon={StorageIcon}
                        color={theme.palette.primary.main}
                    />
                </Grid>
                <Grid item xs={6} sm={3}>
                    <StatCard
                        title="Successful"
                        value={memoizedMetrics.successfulResults.length}
                        icon={CheckCircleIcon}
                        color={theme.palette.success.main}
                    />
                </Grid>
                <Grid item xs={6} sm={3}>
                    <StatCard
                        title="Failed"
                        value={memoizedMetrics.errors.length}
                        icon={ErrorIcon}
                        color={theme.palette.error.main}
                    />
                </Grid>
                <Grid item xs={6} sm={3}>
                    <StatCard
                        title="Error Rate"
                        value={`${((memoizedMetrics.errors.length / results.length) * 100).toFixed(2)}%`}
                        icon={ErrorIcon}
                        color={theme.palette.warning.main}
                    />
                </Grid>
            </MetricSection>

            <MetricSection title="Performance Indicators" id="performanceIndicators">
                <Grid item xs={6} sm={3}>
                    <StatCard
                        title="Avg Response"
                        value={`${memoizedMetrics.avgResponseTime.toFixed(2)} ms`}
                        icon={AccessTimeIcon}
                        color={theme.palette.info.main}
                    />
                </Grid>
                <Grid item xs={6} sm={3}>
                    <StatCard
                        title="Throughput"
                        value={`${(stats.throughput || 0).toFixed(2)} req/s`}
                        icon={SpeedIcon}
                        color={theme.palette.secondary.main}
                    />
                </Grid>
                <Grid item xs={6} sm={3}>
                    <StatCard
                        title="Performance"
                        value={memoizedMetrics.performanceGrade.grade}
                        icon={SpeedIcon}
                        color={memoizedMetrics.performanceGrade.color}
                    />
                </Grid>
                <Grid item xs={6} sm={3}>
                    <StatCard
                        title="SLA Compliance"
                        value={`${memoizedMetrics.sla.toFixed(2)}%`}
                        icon={MemoryIcon}
                        color={theme.palette.success.dark}
                    />
                </Grid>
            </MetricSection>

            <MetricSection title="Advanced Metrics" id="advancedMetrics">
                <Grid item xs={6} sm={3}>
                    <StatCard
                        title="Apdex Score"
                        value={memoizedMetrics.apdex.toFixed(2)}
                        icon={TrendingUpIcon}
                        color={theme.palette.primary.dark}
                    />
                </Grid>
                <Grid item xs={6} sm={3}>
                    <StatCard
                        title="Avg TTFB"
                        value={`${(stats.avgTTFB || 0).toFixed(2)} ms`}
                        icon={AccessTimeIcon}
                        color={theme.palette.info.dark}
                    />
                </Grid>
                <Grid item xs={6} sm={3}>
                    <StatCard
                        title="Min Response"
                        value={`${memoizedMetrics.minResponse.toFixed(2)} ms`}
                        icon={AccessTimeIcon}
                        color={theme.palette.success.light}
                    />
                </Grid>
                <Grid item xs={6} sm={3}>
                    <StatCard
                        title="Max Response"
                        value={`${memoizedMetrics.maxResponse.toFixed(2)} ms`}
                        icon={AccessTimeIcon}
                        color={theme.palette.error.light}
                    />
                </Grid>
            </MetricSection>

            <MetricSection title="Response Time Percentiles" id="responseTimePercentiles">
                <Grid item xs={6} sm={3}>
                    <StatCard
                        title="50th Percentile"
                        value={`${memoizedMetrics.percentiles.p50.toFixed(2)} ms`}
                        icon={TimelineIcon}
                        color={theme.palette.primary.light}
                    />
                </Grid>
                <Grid item xs={6} sm={3}>
                    <StatCard
                        title="90th Percentile"
                        value={`${memoizedMetrics.percentiles.p90.toFixed(2)} ms`}
                        icon={TimelineIcon}
                        color={theme.palette.primary.main}
                    />
                </Grid>
                <Grid item xs={6} sm={3}>
                    <StatCard
                        title="95th Percentile"
                        value={`${memoizedMetrics.percentiles.p95.toFixed(2)} ms`}
                        icon={TimelineIcon}
                        color={theme.palette.primary.dark}
                    />
                </Grid>
                <Grid item xs={6} sm={3}>
                    <StatCard
                        title="99th Percentile"
                        value={`${memoizedMetrics.percentiles.p99.toFixed(2)} ms`}
                        icon={TimelineIcon}
                        color={theme.palette.secondary.main}
                    />
                </Grid>
            </MetricSection>

            <ErrorsSection errors={memoizedMetrics.errors} />
        </Box>
    );
};

export default React.memo(PerformanceMetrics);