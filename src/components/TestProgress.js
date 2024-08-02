import React, { useState, useEffect } from 'react';
import {
    Box, Typography, LinearProgress, Fade, Paper,
    useTheme, CircularProgress, Tooltip, IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AccessTimeIcon from '@mui/icons-material/AccessTime';



const StyledLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 6,
    borderRadius: 3,
    [`&.${LinearProgress}:before`]: {
        backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
    },
    '& .MuiLinearProgress-bar': {
        borderRadius: 3,
    },
}));

const AnimatedCircularProgress = ({ value }) => {
    const [animatedValue, setAnimatedValue] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setAnimatedValue((prevValue) => {
                const diff = value - prevValue;
                return prevValue + (diff > 0 ? Math.max(diff / 10, 0.5) : 0);
            });
        }, 50);

        return () => clearInterval(timer);
    }, [value]);

    return (
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress
                variant="determinate"
                value={animatedValue}
                size={50}
                thickness={4}
                sx={{
                    color: (theme) => theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',

                }}
            />
            <Box
                sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography variant="caption" component="div" color="text.secondary">
                    {`${Math.round(animatedValue)}%`}
                </Typography>
            </Box>
        </Box>
    );
};

const TestProgress = ({ error, isLoading, progress, testName = "Test", startTime }) => {
    const theme = useTheme();

    const getStatusIcon = () => {
        if (error) return <ErrorOutlineIcon color="error" />;
        if (!isLoading && progress === 100) return <CheckCircleOutlineIcon color="success" />;
        return <AccessTimeIcon color="primary" />;
    };

    const getElapsedTime = () => {
        if (!startTime) return '';
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (isLoading || progress === 100) && (
        <Fade in={true}>
            <Paper
                elevation={3}
                sx={{
                    p: 2.5,
                    maxWidth: '100%',
                    width: '100%',
                    mx: 'auto',
                    borderRadius: 2,
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                        boxShadow: 6,
                    },
                    position: 'relative',
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Tooltip title={error ? "Error" : isLoading ? "In Progress" : "Completed"}>
                        <Box sx={{ mr: 2 }}>{getStatusIcon()}</Box>
                    </Tooltip>
                    <Typography variant="h6" color="primary" sx={{ flexGrow: 1, fontWeight: 500 }}>
                        {testName}
                    </Typography>
                    <AnimatedCircularProgress value={progress} />
                    <Tooltip title="More options">
                        <IconButton size="small" sx={{ ml: 1 }}>
                            <MoreVertIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>


                <Box sx={{ width: '100%', mb: 1 }}>
                    <StyledLinearProgress variant="determinate" value={progress} />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                        {isLoading ? "Running..." : progress === 100 ? "Completed" : "Not started"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {getElapsedTime()}
                    </Typography>
                </Box>

                {!isLoading && progress === 100 && (
                    <Fade in={true}>
                        <Box sx={{ display: 'flex', alignItems: 'center', color: 'success.main', mt: 2 }}>
                            <CheckCircleOutlineIcon sx={{ mr: 1 }} />
                            <Typography variant="body2">
                                Test Completed Successfully
                            </Typography>
                        </Box>
                    </Fade>
                )}
            </Paper>
        </Fade>
    );
};

export default TestProgress;