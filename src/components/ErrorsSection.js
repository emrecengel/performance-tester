import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
    Box, Typography, List, ListItem, ListItemText, Collapse,
    IconButton, Divider, TablePagination, Chip, Tooltip,
    Paper, styled
} from '@mui/material';
import {
    ExpandMore, ExpandLess, Error as ErrorIcon,
    Schedule, Link as LinkIcon
} from '@mui/icons-material';

const CompactPaper = styled(Paper)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
}));

const CompactErrorChip = styled(Chip)(({ theme }) => ({
    backgroundColor: theme.palette.error.light,
    color: theme.palette.error.contrastText,
    height: 24,
    '& .MuiChip-label': {
        padding: '0 8px',
    },
}));

const ErrorDetails = ({ error }) => (
    <Box sx={{ pl: 2, pr: 2, pb: 1, fontSize: '0.875rem' }}>
        <Typography variant="subtitle2" gutterBottom>Details</Typography>
        <Box display="flex" flexDirection="column" gap={0.5}>
            <Box display="flex" alignItems="center">
                <Tooltip title="Error URL">
                    <LinkIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                </Tooltip>
                <Typography variant="body2" noWrap>{error.url || 'N/A'}</Typography>
            </Box>
            <Box display="flex" alignItems="center">
                <Tooltip title="Error Message">
                    <ErrorIcon fontSize="small" sx={{ mr: 0.5, color: 'error.main' }} />
                </Tooltip>
                <Typography variant="body2" noWrap>{error.error.message || 'N/A'}</Typography>
            </Box>
            <Box display="flex" alignItems="center">
                <Tooltip title="Timestamp">
                    <Schedule fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                </Tooltip>
                <Typography variant="body2">
                    {error.timestamp ? new Date(error.timestamp).toLocaleString() : 'N/A'}
                </Typography>
            </Box>
            {error.error.stack && (
                <Box mt={0.5}>
                    <Typography variant="caption">Stack Trace:</Typography>
                    <Paper variant="outlined" sx={{ p: 0.5, bgcolor: 'grey.100', maxHeight: 100, overflow: 'auto' }}>
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: '0.75rem' }}>
              {error.error.stack}
            </pre>
                    </Paper>
                </Box>
            )}
        </Box>
    </Box>
);

ErrorDetails.propTypes = {
    error: PropTypes.shape({
        url: PropTypes.string,
        error: PropTypes.shape({
            message: PropTypes.string,
            stack: PropTypes.string,
        }),
        timestamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }).isRequired,
};

const ErrorsSection = ({ errors = [] }) => {
    const [expandedError, setExpandedError] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleToggle = (index) => setExpandedError(expandedError === index ? null : index);
    const handleChangePage = (_, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const paginatedErrors = useMemo(() =>
            errors.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
        [errors, page, rowsPerPage]
    );

    return (
        <CompactPaper>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'error.main' }}>
                    Error Log
                </Typography>
                <CompactErrorChip
                    icon={<ErrorIcon style={{ fontSize: 16 }} />}
                    label={`${errors.length} Error${errors.length !== 1 ? 's' : ''}`}
                />
            </Box>
            <Divider sx={{ mb: 1 }} />
            {errors.length > 0 ? (
                <>
                    <List disablePadding>
                        {paginatedErrors.map((error, index) => (
                            <React.Fragment key={index}>
                                <ListItem
                                    alignItems="flex-start"
                                    secondaryAction={
                                        <IconButton edge="end" onClick={() => handleToggle(index)} size="small">
                                            {expandedError === index ? <ExpandLess /> : <ExpandMore />}
                                        </IconButton>
                                    }
                                    sx={{
                                        py: 0.5,
                                        bgcolor: expandedError === index ? 'action.hover' : 'transparent',
                                        transition: 'background-color 0.2s',
                                        '&:hover': { bgcolor: 'action.hover' },
                                    }}
                                >
                                    <ListItemText
                                        primary={
                                            <Typography variant="subtitle2" color="error">
                                                {error.error.name || 'Unknown error'}
                                            </Typography>
                                        }
                                        secondary={
                                            <Typography variant="caption" color="text.secondary" component="span">
                                                Status: {error.status || 'N/A'} | {new Date(error.timestamp).toLocaleString()}
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                                <Collapse in={expandedError === index} timeout="auto" unmountOnExit>
                                    <ErrorDetails error={error} />
                                </Collapse>
                                <Divider />
                            </React.Fragment>
                        ))}
                    </List>
                    <TablePagination
                        component="div"
                        count={errors.length}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        rowsPerPageOptions={[5, 10, 25]}
                    />
                </>
            ) : (
                <Box textAlign="center" py={2}>
                    <Typography variant="body2" color="text.secondary">
                        No errors to display. Great job!
                    </Typography>
                </Box>
            )}
        </CompactPaper>
    );
};

ErrorsSection.propTypes = {
    errors: PropTypes.arrayOf(
        PropTypes.shape({
            error: PropTypes.shape({
                name: PropTypes.string,
                message: PropTypes.string,
                stack: PropTypes.string,
            }),
            status: PropTypes.string,
            url: PropTypes.string,
            timestamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        })
    ),
};

export default ErrorsSection;