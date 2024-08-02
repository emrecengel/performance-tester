import React from 'react';
import { Paper, Typography, IconButton, Tooltip, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import FullscreenIcon from '@mui/icons-material/Fullscreen';

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    marginBottom: theme.spacing(4),
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[3],
    transition: theme.transitions.create(['box-shadow', 'transform'], {
        duration: theme.transitions.duration.short,
    }),
    '&:hover': {
        boxShadow: theme.shadows[6],
        transform: 'translateY(-4px)',
    },
}));

const ChartTitle = styled(Typography)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    fontWeight: theme.typography.fontWeightBold,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
}));

const ChartContainer = ({
                            title,
                            children,
                            description,
                            onFullscreen,
                            className,
                            ...props
                        }) => (
    <StyledPaper elevation={3} className={className} {...props}>
        <ChartTitle variant="h6" component="div">
            <Box display="flex" alignItems="center">
                {title}
                {description && (
                    <Tooltip title={description} arrow placement="top">
                        <IconButton size="small" sx={{ ml: 1 }}>
                            <InfoOutlinedIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                )}
            </Box>
            {onFullscreen && (
                <Tooltip title="Fullscreen" arrow placement="top">
                    <IconButton onClick={onFullscreen} size="small">
                        <FullscreenIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            )}
        </ChartTitle>
        {children}
    </StyledPaper>
);

export default ChartContainer;