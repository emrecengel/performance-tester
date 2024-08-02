import React, { useState, useMemo } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination,
    Tooltip, Typography, Chip, Box, useTheme, alpha, TextField, InputAdornment,
    Paper, IconButton, Collapse, Grid, Card, CardContent, LinearProgress
} from '@mui/material';
import { styled } from '@mui/system';
import {
    CheckCircleOutline as CheckCircleOutlineIcon,
    ErrorOutline as ErrorOutlineIcon,
    AccessTime as AccessTimeIcon,
    Code as CodeIcon,
    Speed as SpeedIcon,
    Search as SearchIcon,
    KeyboardArrowDown as KeyboardArrowDownIcon,
    KeyboardArrowUp as KeyboardArrowUpIcon,
    FilterList as FilterListIcon
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
    borderRadius: theme.shape.borderRadius,
    background: theme.palette.background.paper,
    boxShadow: 'none',
    border: `1px solid ${theme.palette.divider}`,
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
    backgroundColor: theme.palette.grey[100],
    '& th': {
        color: theme.palette.text.secondary,
        fontWeight: 600,
        lineHeight: '1.5rem',
        fontSize: '0.875rem',
        padding: '12px 16px',
        borderBottom: `2px solid ${theme.palette.divider}`,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(even)': {
        backgroundColor: alpha(theme.palette.primary.light, 0.03),
    },
    '&:hover': {
        backgroundColor: alpha(theme.palette.primary.light, 0.07),
        transition: 'background-color 0.2s ease-in-out',
    },
    '& td': {
        borderBottom: `1px solid ${theme.palette.divider}`,
        padding: '12px 16px',
    },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
}));

const StyledCard = styled(Card)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    boxShadow: 'none',
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    transition: 'box-shadow 0.3s ease-in-out',
    '&:hover': {
        boxShadow: theme.shadows[4],
    },
}));

const CallStatusIcon = ({ status }) => {
    const theme = useTheme();
    return status === 200 ? (
        <CheckCircleOutlineIcon style={{ color: theme.palette.success.main, fontSize: '1.25rem' }} />
    ) : (
        <ErrorOutlineIcon style={{ color: theme.palette.error.main, fontSize: '1.25rem' }} />
    );
};

const DetailedResults = ({ results }) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedRow, setExpandedRow] = useState(null);
    const theme = useTheme();

    const filteredResults = useMemo(() => {
        return results.filter(result =>
            result.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
            result.status.toString().includes(searchTerm) ||
            (result.error && result.error.code.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [results, searchTerm]);

    const handleChangePage = (event, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const renderCell = (icon, content) => (
        <IconWrapper>
            {icon}
            <Typography variant="body2">{content}</Typography>
        </IconWrapper>
    );

    const getStatusSummary = () => {
        const summary = { success: 0, error: 0 };
        results.forEach(result => result.status === 200 ? summary.success++ : summary.error++);
        return summary;
    };

    const statusSummary = getStatusSummary();

    const getResponseTimeData = () => {
        return results.map(result => ({
            url: result.url.split('/').pop(), // Get the last part of the URL
            responseTime: result.responseTime
        })).sort((a, b) => b.responseTime - a.responseTime).slice(0, 5); // Top 5 slowest
    };

    return (
        <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <StyledCard>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Status Summary</Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Typography variant="body2">Success</Typography>
                                <Typography variant="body2">{statusSummary.success}</Typography>
                            </Box>
                            <LinearProgress
                                variant="determinate"
                                value={(statusSummary.success / results.length) * 100}
                                sx={{ mb: 2, height: 10, borderRadius: 5 }}
                            />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Typography variant="body2">Error</Typography>
                                <Typography variant="body2">{statusSummary.error}</Typography>
                            </Box>
                            <LinearProgress
                                variant="determinate"
                                value={(statusSummary.error / results.length) * 100}
                                sx={{ mb: 2, height: 10, borderRadius: 5 }}
                                color="error"
                            />
                        </CardContent>
                    </StyledCard>
                </Grid>
                <Grid item xs={12} md={8}>
                    <StyledCard>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Top 5 Slowest Responses</Typography>
                            <ResponsiveContainer width="100%" height={200}>
                                <BarChart data={getResponseTimeData()}>
                                    <XAxis dataKey="url" />
                                    <YAxis />
                                    <RechartsTooltip />
                                    <Bar dataKey="responseTime" fill={theme.palette.primary.main} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </StyledCard>
                </Grid>
                <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h5" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                            Detailed Results
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                size="small"
                                variant="outlined"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <IconButton>
                                <FilterListIcon />
                            </IconButton>
                        </Box>
                    </Box>
                    <StyledTableContainer>
                        <Table size="medium" sx={{ minWidth: 650 }} aria-label="detailed results table">
                            <StyledTableHead>
                                <TableRow>
                                    <TableCell />
                                    <TableCell>Status</TableCell>
                                    <TableCell>URL</TableCell>
                                    <TableCell align="right">Response Time</TableCell>
                                    <TableCell align="right">Status Code</TableCell>
                                    <TableCell align="right">TTFB</TableCell>
                                </TableRow>
                            </StyledTableHead>
                            <TableBody>
                                {filteredResults.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((result, index) => (
                                    <React.Fragment key={index}>
                                        <StyledTableRow>
                                            <TableCell>
                                                <IconButton
                                                    aria-label="expand row"
                                                    size="small"
                                                    onClick={() => setExpandedRow(expandedRow === index ? null : index)}
                                                >
                                                    {expandedRow === index ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                                </IconButton>
                                            </TableCell>
                                            <TableCell>
                                                <Tooltip title={result.status === 200 ? "Success" : "Error"}>
                                                    <span><CallStatusIcon status={result.status} /></span>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell>
                                                <Tooltip title={result.url}>
                                                    <Typography noWrap sx={{ maxWidth: 180 }}>{result.url}</Typography>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell align="right">
                                                {result.responseTime ? renderCell(
                                                    <AccessTimeIcon fontSize="small" color="action" />,
                                                    `${result.responseTime.toFixed(2)} ms`
                                                ) : 'N/A'}
                                            </TableCell>
                                            <TableCell align="right">
                                                {renderCell(
                                                    <CodeIcon fontSize="small" color="action" />,
                                                    <Chip
                                                        label={result.status}
                                                        color={result.status === 200 ? "success" : "error"}
                                                        size="small"
                                                        sx={{ fontWeight: 'bold' }}
                                                    />
                                                )}
                                            </TableCell>
                                            <TableCell align="right">
                                                {renderCell(
                                                    <SpeedIcon fontSize="small" color="action" />,
                                                    result.ttfb !== 'N/A' ? `${result.ttfb.toFixed(2)} ms` : 'N/A'
                                                )}
                                            </TableCell>
                                        </StyledTableRow>
                                        <TableRow>
                                            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                                <Collapse in={expandedRow === index} timeout="auto" unmountOnExit>
                                                    <Box sx={{ margin: 1 }}>
                                                        <Typography variant="h6" gutterBottom component="div">
                                                            Additional Details
                                                        </Typography>
                                                        <Table size="small" aria-label="additional details">
                                                            <TableBody>
                                                                <TableRow>
                                                                    <TableCell component="th" scope="row">Error Details</TableCell>
                                                                    <TableCell>
                                                                        {result.error ? (
                                                                            <Tooltip title={`${result.error.name}: ${result.error.message}`}>
                                                                                <Chip
                                                                                    label={result.error.code}
                                                                                    color="error"
                                                                                    size="small"
                                                                                    variant="outlined"
                                                                                />
                                                                            </Tooltip>
                                                                        ) : 'N/A'}
                                                                    </TableCell>
                                                                </TableRow>
                                                                {/* Add more rows here for additional details */}
                                                            </TableBody>
                                                        </Table>
                                                    </Box>
                                                </Collapse>
                                            </TableCell>
                                        </TableRow>
                                    </React.Fragment>
                                ))}
                            </TableBody>
                        </Table>
                    </StyledTableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={filteredResults.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Grid>
            </Grid>
        </Paper>
    );
};

export default DetailedResults;