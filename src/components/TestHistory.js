import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button } from '@mui/material';

const TestHistory = ({ history, clearHistory, loadTestRun }) => {
    const formatDate = (date) => {
        return new Date(date).toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    return (
        <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: '12px' }}>
            <Typography variant="h6" gutterBottom>Test History</Typography>
            {history.length === 0 ? (
                <Typography>No test runs recorded yet.</Typography>
            ) : (
                <>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Run ID</TableCell>
                                    <TableCell>Start Time</TableCell>
                                    <TableCell>Duration</TableCell>
                                    <TableCell>Requests</TableCell>
                                    <TableCell>Concurrency</TableCell>
                                    <TableCell>Avg Response Time</TableCell>
                                    <TableCell>Error Rate</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {history.map((run) => (
                                    <TableRow key={run.id}>
                                        <TableCell>{run.id}</TableCell>
                                        <TableCell>{formatDate(run.startTime)}</TableCell>
                                        <TableCell>{run.duration} min</TableCell>
                                        <TableCell>{run.numRequests}</TableCell>
                                        <TableCell>{run.concurrency}</TableCell>
                                        <TableCell>{run.stats.avgResponseTime.toFixed(2)} ms</TableCell>
                                        <TableCell>{run.stats.errorRate.toFixed(2)}%</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                size="small"
                                                onClick={() => loadTestRun(run)}
                                            >
                                                Load
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Button variant="outlined" color="secondary" onClick={clearHistory} sx={{ mt: 2 }}>
                        Clear History
                    </Button>
                </>
            )}
        </Paper>
    );
};

export default TestHistory;