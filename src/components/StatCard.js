import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
    height: '100%',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: theme.shadows[4],
    },
}));

const StatCard = ({ title, value, icon: Icon, color }) => (
    <StyledCard elevation={1}>
        <CardContent>
            <Box display="flex" alignItems="center" mb={1}>
                <Icon style={{ color, marginRight: 8, fontSize: 20 }} />
                <Typography variant="body2" color="text.secondary">
                    {title}
                </Typography>
            </Box>
            <Typography variant="h6" component="div" fontWeight="medium">
                {value}
            </Typography>
        </CardContent>
    </StyledCard>
);

export default StatCard;