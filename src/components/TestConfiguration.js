import React, { useState } from 'react';
import {
    Paper, Typography, Grid, TextField, Button, Box,
    Tooltip, IconButton, Snackbar, Alert, Divider, Chip
} from '@mui/material';
import {
    Storage as StorageIcon,
    AccessTime as AccessTimeIcon,
    Speed as SpeedIcon,
    CloudUpload as CloudUploadIcon,
    Send as SendIcon,
    Info as InfoIcon
} from '@mui/icons-material';
import CircularProgress from '@mui/material/CircularProgress';
import { useTheme } from '@mui/material/styles';

const TestConfiguration = ({
                               numRequests,
                               setNumRequests,
                               duration,
                               setDuration,
                               concurrency,
                               setConcurrency,
                               setCsvContent,
                               csvContent,
                               runTest,
                               isLoading
                           }) => {
    const theme = useTheme();
    const [fileName, setFileName] = useState('');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setCsvContent(e.target.result);
                setFileName(file.name);
                setSnackbar({ open: true, message: `File ${file.name} uploaded successfully`, severity: 'success' });
            };
            reader.onerror = () => {
                setSnackbar({ open: true, message: 'Error reading file', severity: 'error' });
            };
            reader.readAsText(file);
        }
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <Paper elevation={3} sx={{
            p: 4,
            mb: 4,
            borderRadius: '16px',
            background: theme.palette.mode === 'dark'
                ? `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[900]} 100%)`
                : `linear-gradient(145deg, ${theme.palette.common.white} 0%, ${theme.palette.grey[100]} 100%)`,
            transition: theme.transitions.create(['box-shadow', 'transform'], {
                duration: theme.transitions.duration.standard,
            }),
            '&:hover': {
                boxShadow: theme.shadows[10],
                transform: 'translateY(-4px)',
            }
        }}>

            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        fullWidth
                        label="Number of Requests"
                        type="number"
                        value={numRequests}
                        onChange={(e) => setNumRequests(Math.max(0, parseInt(e.target.value)))}
                        InputProps={{
                            startAdornment: <StorageIcon color="action" sx={{ mr: 1 }} />,
                        }}
                        variant="outlined"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        fullWidth
                        label="Duration (minutes)"
                        type="number"
                        value={duration}
                        onChange={(e) => setDuration(Math.max(0, parseInt(e.target.value)))}
                        InputProps={{
                            startAdornment: <AccessTimeIcon color="action" sx={{ mr: 1 }} />,
                        }}
                        variant="outlined"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        fullWidth
                        label="Concurrency"
                        type="number"
                        value={concurrency}
                        onChange={(e) => setConcurrency(Math.max(0, parseInt(e.target.value)))}
                        InputProps={{
                            startAdornment: <SpeedIcon color="action" sx={{ mr: 1 }} />,
                        }}
                        variant="outlined"
                    />
                </Grid>
            </Grid>
            <Box mt={4} display="flex" justifyContent="space-between" alignItems="center">
                <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, mr: 2 }}>
                    <Button
                        variant="outlined"
                        component="label"
                        fullWidth
                        startIcon={<CloudUploadIcon />}
                        sx={{
                            height: '56px',
                            textTransform: 'none',
                            borderRadius: '28px',
                            transition: theme.transitions.create(['background-color', 'color', 'box-shadow'], {
                                duration: theme.transitions.duration.short,
                            }),
                            '&:hover': {
                                backgroundColor: theme.palette.primary.main,
                                color: theme.palette.common.white,
                                boxShadow: theme.shadows[4],
                            }
                        }}
                    >
                        {fileName || 'Upload CSV'}
                        <input
                            type="file"
                            hidden
                            accept=".csv"
                            onChange={handleFileUpload}
                        />
                    </Button>
                    <Tooltip title="Upload a CSV file with test data">
                        <IconButton size="small" sx={{ ml: 1 }}>
                            <InfoIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={runTest}
                    disabled={!csvContent || isLoading}
                    startIcon={isLoading ? <CircularProgress size={24} color="inherit" /> : <SendIcon />}
                    sx={{
                        minWidth: '180px',
                        height: '56px',
                        borderRadius: '28px',
                        textTransform: 'none',
                        fontSize: '1rem',
                        transition: theme.transitions.create(['transform', 'box-shadow'], {
                            duration: theme.transitions.duration.short,
                        }),
                        '&:not(:disabled):hover': {
                            transform: 'translateY(-2px) scale(1.02)',
                            boxShadow: theme.shadows[8],
                        }
                    }}
                >
                    {isLoading ? 'Running Test...' : 'Run Test'}
                </Button>
            </Box>
            {csvContent && (
                <Typography variant="body2" color="textSecondary" mt={2}>
                    File loaded: {fileName}
                </Typography>
            )}
            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Paper>
    );
};

export default TestConfiguration;