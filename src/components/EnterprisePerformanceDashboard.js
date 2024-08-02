import React, { useState, useCallback, useMemo } from 'react';
import {
    AppBar, Toolbar, Typography, Container, Box, IconButton, Menu, MenuItem,
    ListItemIcon, ListItemText, Drawer, List, ListItem, ListItemButton,
    Tabs, Tab, Paper, Grid, Fade, Tooltip, useMediaQuery, CssBaseline,
    ThemeProvider, createTheme, Divider, Chip
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import {
    Menu as MenuIcon, MoreVert as MoreVertIcon, Refresh as RefreshIcon,
    CloudDownload as CloudDownloadIcon, Print as PrintIcon, Share as ShareIcon,
    Dashboard as DashboardIcon, History as HistoryIcon, Settings as SettingsIcon,
    Speed as SpeedIcon, Timeline as TimelineIcon, BarChart as BarChartIcon,
    NetworkCheck as NetworkCheckIcon, Brightness4 as Brightness4Icon,
    Brightness7 as Brightness7Icon, Business as BusinessIcon
} from '@mui/icons-material';

import TestConfiguration from './TestConfiguration';
import TestProgress from './TestProgress';
import PerformanceMetrics from './PerformanceMetrics';
import PerformanceOverview from './PerformanceOverview';
import DetailedResults from './DetailedResults';
import TestHistory from './TestHistory';
import EndpointPerformance from "./EndpointPerformance";

import useTestState from '../hooks/useTestState';

const drawerWidth = 240;

const StyledAppBar = styled(AppBar)(({ theme }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    background: theme.palette.mode === 'dark'
        ? `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)`
        : `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
}));

const StyledDrawer = styled(Drawer)(({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
        ...theme.mixins.openDrawer,
        '& .MuiDrawer-paper': theme.mixins.openDrawer,
    }),
    ...(!open && {
        ...theme.mixins.closedDrawer,
        '& .MuiDrawer-paper': theme.mixins.closedDrawer,
    }),
}));

const StyledTab = styled(Tab)(({ theme }) => ({
    minHeight: 64,
    minWidth: 0,
    [theme.breakpoints.up('sm')]: {
        minWidth: 120,
    },
    fontSize: '0.875rem',
    fontWeight: theme.typography.fontWeightMedium,
    textTransform: 'none',
    '&.Mui-selected': {
        color: theme.palette.primary.main,
    },
}));

const Navbar = ({ onMenuToggle, onHistoryClick, onThemeToggle, isDarkMode }) => (
    <StyledAppBar position="fixed">
        <Toolbar>
            <IconButton color="inherit" edge="start" onClick={onMenuToggle} sx={{ mr: 2 }}>
                <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                <BusinessIcon sx={{ mr: 1 }} />
                Enterprise B2B API Performance Dashboard
            </Typography>
            <Tooltip title="Toggle dark mode">
                <IconButton color="inherit" onClick={onThemeToggle}>
                    {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
            </Tooltip>
            <Tooltip title="View History">
                <IconButton color="inherit" onClick={onHistoryClick}>
                    <HistoryIcon />
                </IconButton>
            </Tooltip>
        </Toolbar>
    </StyledAppBar>
);

const Sidebar = ({ open, onClose, onOpen }) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <StyledDrawer
            variant={isSmallScreen ? "temporary" : "permanent"}
            open={open}
            onClose={onClose}
            onMouseEnter={onOpen}
            onMouseLeave={onClose}
        >
            <Toolbar />
            <List>
                {[
                    { text: 'Dashboard', icon: <DashboardIcon /> },
                    { text: 'Settings', icon: <SettingsIcon /> },
                ].map((item) => (
                    <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
                        <ListItemButton
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? 'initial' : 'center',
                                px: 2.5,
                                borderRadius: '0 20px 20px 0',
                                mr: 1,
                                '&:hover': {
                                    backgroundColor: theme.palette.action.hover,
                                },
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : 'auto',
                                    justifyContent: 'center',
                                }}
                            >
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0 }} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </StyledDrawer>
    );
};

const VerticalTabs = ({ value, onChange }) => (
    <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={onChange}
        sx={{
            borderRight: 1,
            borderColor: 'divider',
            '& .MuiTabs-indicator': {
                left: 0,
                right: 'auto',
            },
        }}
    >
        <StyledTab icon={<SpeedIcon />} label="Metrics" />
        <StyledTab icon={<TimelineIcon />} label="Overview" />
        <StyledTab icon={<BarChartIcon />} label="Detailed" />
        <StyledTab icon={<NetworkCheckIcon />} label="Endpoint Performance" />
    </Tabs>
);

const EnterprisePerformanceDashboard = () => {
    const {
        csvContent, setCsvContent, numRequests, setNumRequests, duration, setDuration,
        concurrency, setConcurrency, results, isLoading, progress, error, stats,
        history, clearHistory, loadTestRun, runTest
    } = useTestState();

    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedRun, setSelectedRun] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const [showHistory, setShowHistory] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);
    const handleLoadTestRun = useCallback((run) => {
        loadTestRun(run);
        setSelectedRun(run);
        setShowHistory(false);
    }, [loadTestRun]);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const openSidebar = () => setSidebarOpen(true);
    const closeSidebar = () => setSidebarOpen(false);
    const handleTabChange = (event, newValue) => setActiveTab(newValue);
    const handleHistoryClick = () => setShowHistory(!showHistory);
    const handleThemeToggle = () => setIsDarkMode(!isDarkMode);

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode: isDarkMode ? 'dark' : 'light',
                    primary: {
                        main: isDarkMode ? '#90caf9' : '#1976d2',
                    },
                    background: {
                        default: isDarkMode ? '#303030' : '#f5f5f5',
                        paper: isDarkMode ? '#424242' : '#ffffff',
                    },
                },
                typography: {
                    fontFamily: 'Roboto, Arial, sans-serif',
                },
                shape: {
                    borderRadius: 8,
                },
                mixins: {
                    openDrawer: {
                        width: drawerWidth,
                        transition: 'width 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
                    },
                    closedDrawer: {
                        transition: 'width 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
                        overflowX: 'hidden',
                        width: '64px',
                        [('@media (min-width:600px)')]: {
                            width: '72px',
                        },
                    },
                },
                components: {
                    MuiButton: {
                        styleOverrides: {
                            root: {
                                textTransform: 'none',
                                borderRadius: '20px',
                            },
                        },
                    },
                    MuiPaper: {
                        styleOverrides: {
                            root: {
                                borderRadius: '12px',
                            },
                        },
                    },
                },
            }),
        [isDarkMode]
    );

    const contentToRender = useMemo(() => {
        if (showHistory) {
            return (
                <TestHistory
                    history={history}
                    clearHistory={clearHistory}
                    loadTestRun={handleLoadTestRun}
                />
            );
        } else if (isLoading || results.length > 0 || selectedRun) {
            return (
                <Grid container spacing={3}>
                    <Grid item xs={12} md={3}>
                        <Paper elevation={3} sx={{ height: '100%', p: 2 }}>
                            <VerticalTabs value={activeTab} onChange={handleTabChange} />
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={9}>
                        <Paper elevation={3} sx={{ p: 3 }}>
                            <Fade in={true} timeout={500}>
                                <div>
                                    {activeTab === 0 && <PerformanceMetrics stats={stats} results={results} />}
                                    {activeTab === 1 && <PerformanceOverview results={results} />}
                                    {activeTab === 2 && <DetailedResults results={results} />}
                                    {activeTab === 3 && <EndpointPerformance endpointStats={stats.endpointPerformance} />}
                                </div>
                            </Fade>
                        </Paper>
                    </Grid>
                </Grid>
            );
        }
        return null;
    }, [showHistory, isLoading, results, selectedRun, activeTab, history, clearHistory, handleLoadTestRun, stats]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ display: 'flex' }}>
                <Navbar
                    onMenuToggle={toggleSidebar}
                    onHistoryClick={handleHistoryClick}
                    onThemeToggle={handleThemeToggle}
                    isDarkMode={isDarkMode}
                />
                <Sidebar open={sidebarOpen} onClose={closeSidebar} onOpen={openSidebar} />
                <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
                    <Container maxWidth="lg">

                            <TestConfiguration
                                numRequests={numRequests}
                                setNumRequests={setNumRequests}
                                duration={duration}
                                setDuration={setDuration}
                                concurrency={concurrency}
                                setConcurrency={setConcurrency}
                                setCsvContent={setCsvContent}
                                csvContent={csvContent}
                                runTest={runTest}
                                isLoading={isLoading}
                            />




                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleMenuClose}
                            >
                                <MenuItem onClick={handleMenuClose}>
                                    <ListItemIcon>
                                        <RefreshIcon fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText>Refresh Data</ListItemText>
                                </MenuItem>
                                <MenuItem onClick={handleMenuClose}>
                                    <ListItemIcon>
                                        <CloudDownloadIcon fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText>Export Report</ListItemText>
                                </MenuItem>
                                <MenuItem onClick={handleMenuClose}>
                                    <ListItemIcon>
                                        <PrintIcon fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText>Print Dashboard</ListItemText>
                                </MenuItem>
                                <MenuItem onClick={handleMenuClose}>
                                    <ListItemIcon>
                                        <ShareIcon fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText>Share Dashboard</ListItemText>
                                </MenuItem>
                            </Menu>

                            <Box sx={{ mb: 3 }}>
                                <TestProgress error={error} isLoading={isLoading} progress={progress} testName="Performance Test" />
                            </Box>

                            {contentToRender}

                    </Container>
                </Box>
            </Box>
        </ThemeProvider>
    );
};

// Custom styled components for enhanced visual appeal
const StyledPaper = styled(Paper)(({ theme }) => ({
    borderRadius: '16px',
    boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)',
    transition: theme.transitions.create(['box-shadow', 'transform'], {
        duration: theme.transitions.duration.shorter,
    }),
    '&:hover': {
        boxShadow: '0 8px 30px 0 rgba(0,0,0,0.2)',
        transform: 'translateY(-4px)',
    },
}));

const GradientTypography = styled(Typography)(({ theme }) => ({
    background: theme.palette.mode === 'dark'
        ? `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
        : `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: 'bold',
}));

// Enhanced EnterprisePerformanceDashboard with additional styling
const EnhancedEnterprisePerformanceDashboard = () => {
    const dashboard = EnterprisePerformanceDashboard();

    return React.cloneElement(dashboard, {
        children: React.Children.map(dashboard.props.children, (child) => {
            if (child.type === Box && child.props.component === 'main') {
                return React.cloneElement(child, {
                    children: (
                        <Container maxWidth="lg">
                            <StyledPaper elevation={3} sx={{ p: 3, mb: 3 }}>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                    <GradientTypography variant="h4">
                                        Enterprise API Performance Suite
                                    </GradientTypography>
                                    <Chip
                                        icon={<BusinessIcon />}
                                        label="Enterprise Grade"
                                        color="primary"
                                        size="small"
                                    />
                                </Box>
                                <Divider sx={{ mb: 3 }} />
                                {child.props.children.props.children}
                            </StyledPaper>
                        </Container>
                    ),
                });
            }
            return child;
        }),
    });
};

export default EnhancedEnterprisePerformanceDashboard;