import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
    Paper, Typography, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, TablePagination, Box, Chip, Tooltip,
    LinearProgress, TextField, InputAdornment
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
    CheckCircle as CheckCircleIcon,
    Warning as WarningIcon,
    Error as ErrorIcon,
    Schedule as ScheduleIcon,
    Speed as SpeedIcon,
    Search as SearchIcon,
    RouteOutlined as RouteIcon
} from '@mui/icons-material';

const StyledPaper = styled(Paper)(({ theme }) => ({
    marginBottom: theme.spacing(3),
    padding: theme.spacing(3),
    borderRadius: theme.shape.borderRadius * 2,
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    fontWeight: 'bold',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
}));

const StatusChip = styled(Chip)(({ theme, status }) => ({
    backgroundColor:
        status === 'excellent' ? theme.palette.success.main :
            status === 'good' ? theme.palette.info.main :
                status === 'fair' ? theme.palette.warning.main :
                    theme.palette.error.main,
    color: theme.palette.common.white,
}));

const getStatusIcon = (status) => {
    switch(status) {
        case 'excellent': return <CheckCircleIcon />;
        case 'good': return <CheckCircleIcon />;
        case 'fair': return <WarningIcon />;
        default: return <ErrorIcon />;
    }
};

const getStatus = (successRate) => {
    if (successRate >= 99) return 'excellent';
    if (successRate >= 95) return 'good';
    if (successRate >= 90) return 'fair';
    return 'poor';
};

const EndpointPerformance = ({ endpointStats }) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const endpointData = useMemo(() =>
            Object.entries(endpointStats || {}).map(([url, data]) => ({
                url,
                totalRequests: data.totalRequests,
                avgResponseTime: data.avgResponseTime,
                successRate: data.successRate,
                status: getStatus(data.successRate)
            })),
        [endpointStats]
    );

    const filteredData = useMemo(() =>
            endpointData.filter(row =>
                row.url.toLowerCase().includes(searchTerm.toLowerCase())
            ),
        [endpointData, searchTerm]
    );

    const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <StyledPaper>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    Endpoint Performance
                </Typography>
                <Chip
                    icon={<RouteIcon />}
                    label={`${filteredData.length} Endpoints`}
                    color="primary"
                />
            </Box>
            <Box mb={2}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search endpoints..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>
            <TableContainer>
                <Table size="medium">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>
                                <Tooltip title="Endpoint URL">
                                    <Box display="flex" alignItems="center">
                                        <RouteIcon sx={{ mr: 1 }} />
                                        Endpoint
                                    </Box>
                                </Tooltip>
                            </StyledTableCell>
                            <StyledTableCell align="right">
                                <Tooltip title="Total number of requests">
                                    <Box display="flex" alignItems="center" justifyContent="flex-end">
                                        <SpeedIcon sx={{ mr: 1 }} />
                                        Requests
                                    </Box>
                                </Tooltip>
                            </StyledTableCell>
                            <StyledTableCell align="right">
                                <Tooltip title="Average response time">
                                    <Box display="flex" alignItems="center" justifyContent="flex-end">
                                        <ScheduleIcon sx={{ mr: 1 }} />
                                        Avg Time (ms)
                                    </Box>
                                </Tooltip>
                            </StyledTableCell>
                            <StyledTableCell align="right">Success Rate</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedData.map((row) => (
                            <TableRow key={row.url} hover>
                                <TableCell component="th" scope="row">
                                    <Tooltip title={row.url}>
                                        <Typography noWrap sx={{ maxWidth: 250 }}>
                                            {row.url}
                                        </Typography>
                                    </Tooltip>
                                </TableCell>
                                <TableCell align="right">{row.totalRequests.toLocaleString()}</TableCell>
                                <TableCell align="right">
                                    <Box display="flex" alignItems="center" justifyContent="flex-end">
                                        {row.avgResponseTime.toFixed(2)}
                                        <Tooltip title={`Response time: ${row.avgResponseTime.toFixed(2)}ms`}>
                                            <Box width="100px" ml={1}>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={Math.min((row.avgResponseTime / 1000) * 100, 100)}
                                                    color={row.avgResponseTime < 500 ? "success" : row.avgResponseTime < 1000 ? "warning" : "error"}
                                                />
                                            </Box>
                                        </Tooltip>
                                    </Box>
                                </TableCell>
                                <TableCell align="right">
                                    <StatusChip
                                        icon={getStatusIcon(row.status)}
                                        label={`${row.successRate.toFixed(2)}%`}
                                        status={row.status}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </StyledPaper>
    );
};

EndpointPerformance.propTypes = {
    endpointStats: PropTypes.objectOf(
        PropTypes.shape({
            totalRequests: PropTypes.number.isRequired,
            avgResponseTime: PropTypes.number.isRequired,
            successRate: PropTypes.number.isRequired,
        })
    ).isRequired,
};

export default EndpointPerformance;