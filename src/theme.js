import { createTheme, alpha } from '@mui/material/styles';

// Define color palette
const palette = {
    primary: {
        main: '#3498db',
        light: '#5dade2',
        dark: '#2980b9',
        contrastText: '#ffffff',
    },
    secondary: {
        main: '#2ecc71',
        light: '#52be80',
        dark: '#27ae60',
        contrastText: '#ffffff',
    },
    error: {
        main: '#e74c3c',
        light: '#f29f97',
        dark: '#d62c1a',
        contrastText: '#ffffff',
    },
    warning: {
        main: '#f39c12',
        light: '#f8c471',
        dark: '#c87f0a',
        contrastText: '#ffffff',
    },
    info: {
        main: '#3498db',
        light: '#75b9e7',
        dark: '#2980b9',
        contrastText: '#ffffff',
    },
    success: {
        main: '#2ecc71',
        light: '#7ee2a8',
        dark: '#25a25a',
        contrastText: '#ffffff',
    },
    grey: {
        50: '#f9fafb',
        100: '#f3f4f6',
        200: '#e5e7eb',
        300: '#d1d5db',
        400: '#9ca3af',
        500: '#6b7280',
        600: '#4b5563',
        700: '#374151',
        800: '#1f2937',
        900: '#111827',
    },
    background: {
        default: '#f4f6f8',
        paper: '#ffffff',
    },
    text: {
        primary: '#2c3e50',
        secondary: '#7f8c8d',
        disabled: '#bdc3c7',
    },
};

// Create theme
const theme = createTheme({
    palette,
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        fontWeightLight: 300,
        fontWeightRegular: 400,
        fontWeightMedium: 500,
        fontWeightBold: 700,
        h1: {
            fontWeight: 700,
            fontSize: '3rem',
            lineHeight: 1.2,
            letterSpacing: '-0.01562em',
        },
        h2: {
            fontWeight: 600,
            fontSize: '2.5rem',
            lineHeight: 1.3,
            letterSpacing: '-0.00833em',
        },
        h3: {
            fontWeight: 600,
            fontSize: '2rem',
            lineHeight: 1.4,
            letterSpacing: '0em',
        },
        h4: {
            fontWeight: 600,
            fontSize: '1.75rem',
            lineHeight: 1.4,
            letterSpacing: '0.00735em',
        },
        h5: {
            fontWeight: 600,
            fontSize: '1.5rem',
            lineHeight: 1.5,
            letterSpacing: '0em',
        },
        h6: {
            fontWeight: 600,
            fontSize: '1.25rem',
            lineHeight: 1.6,
            letterSpacing: '0.0075em',
        },
        subtitle1: {
            fontSize: '1rem',
            lineHeight: 1.75,
            letterSpacing: '0.00938em',
        },
        subtitle2: {
            fontSize: '0.875rem',
            lineHeight: 1.57,
            letterSpacing: '0.00714em',
        },
        body1: {
            fontSize: '1rem',
            lineHeight: 1.5,
            letterSpacing: '0.00938em',
        },
        body2: {
            fontSize: '0.875rem',
            lineHeight: 1.43,
            letterSpacing: '0.01071em',
        },
        button: {
            fontSize: '0.875rem',
            textTransform: 'none',
            fontWeight: 600,
            letterSpacing: '0.02857em',
        },
        caption: {
            fontSize: '0.75rem',
            lineHeight: 1.66,
            letterSpacing: '0.03333em',
        },
        overline: {
            fontSize: '0.75rem',
            lineHeight: 2.66,
            letterSpacing: '0.08333em',
            textTransform: 'uppercase',
        },
    },
    shape: {
        borderRadius: 8,
    },
    shadows: [
        'none',
        '0px 2px 1px -1px rgba(0,0,0,0.06),0px 1px 1px 0px rgba(0,0,0,0.04),0px 1px 3px 0px rgba(0,0,0,0.02)',
        '0px 3px 1px -2px rgba(0,0,0,0.06),0px 2px 2px 0px rgba(0,0,0,0.04),0px 1px 5px 0px rgba(0,0,0,0.02)',
        '0px 3px 3px -2px rgba(0,0,0,0.06),0px 3px 4px 0px rgba(0,0,0,0.04),0px 1px 8px 0px rgba(0,0,0,0.02)',
        '0px 2px 4px -1px rgba(0,0,0,0.06),0px 4px 5px 0px rgba(0,0,0,0.04),0px 1px 10px 0px rgba(0,0,0,0.02)',
        '0px 3px 5px -1px rgba(0,0,0,0.06),0px 5px 8px 0px rgba(0,0,0,0.04),0px 1px 14px 0px rgba(0,0,0,0.02)',
        '0px 3px 5px -1px rgba(0,0,0,0.06),0px 6px 10px 0px rgba(0,0,0,0.04),0px 1px 18px 0px rgba(0,0,0,0.02)',
        '0px 4px 5px -2px rgba(0,0,0,0.06),0px 7px 10px 1px rgba(0,0,0,0.04),0px 2px 16px 1px rgba(0,0,0,0.02)',
        '0px 5px 5px -3px rgba(0,0,0,0.06),0px 8px 10px 1px rgba(0,0,0,0.04),0px 3px 14px 2px rgba(0,0,0,0.02)',
        '0px 5px 6px -3px rgba(0,0,0,0.06),0px 9px 12px 1px rgba(0,0,0,0.04),0px 3px 16px 2px rgba(0,0,0,0.02)',
        '0px 6px 6px -3px rgba(0,0,0,0.06),0px 10px 14px 1px rgba(0,0,0,0.04),0px 4px 18px 3px rgba(0,0,0,0.02)',
        '0px 6px 7px -4px rgba(0,0,0,0.06),0px 11px 15px 1px rgba(0,0,0,0.04),0px 4px 20px 3px rgba(0,0,0,0.02)',
        '0px 7px 8px -4px rgba(0,0,0,0.06),0px 12px 17px 2px rgba(0,0,0,0.04),0px 5px 22px 4px rgba(0,0,0,0.02)',
        '0px 7px 8px -4px rgba(0,0,0,0.06),0px 13px 19px 2px rgba(0,0,0,0.04),0px 5px 24px 4px rgba(0,0,0,0.02)',
        '0px 7px 9px -4px rgba(0,0,0,0.06),0px 14px 21px 2px rgba(0,0,0,0.04),0px 5px 26px 4px rgba(0,0,0,0.02)',
        '0px 8px 9px -5px rgba(0,0,0,0.06),0px 15px 22px 2px rgba(0,0,0,0.04),0px 6px 28px 5px rgba(0,0,0,0.02)',
        '0px 8px 10px -5px rgba(0,0,0,0.06),0px 16px 24px 2px rgba(0,0,0,0.04),0px 6px 30px 5px rgba(0,0,0,0.02)',
        '0px 8px 11px -5px rgba(0,0,0,0.06),0px 17px 26px 2px rgba(0,0,0,0.04),0px 6px 32px 5px rgba(0,0,0,0.02)',
        '0px 9px 11px -5px rgba(0,0,0,0.06),0px 18px 28px 2px rgba(0,0,0,0.04),0px 7px 34px 6px rgba(0,0,0,0.02)',
        '0px 9px 12px -6px rgba(0,0,0,0.06),0px 19px 29px 2px rgba(0,0,0,0.04),0px 7px 36px 6px rgba(0,0,0,0.02)',
        '0px 10px 13px -6px rgba(0,0,0,0.06),0px 20px 31px 3px rgba(0,0,0,0.04),0px 8px 38px 7px rgba(0,0,0,0.02)',
        '0px 10px 13px -6px rgba(0,0,0,0.06),0px 21px 33px 3px rgba(0,0,0,0.04),0px 8px 40px 7px rgba(0,0,0,0.02)',
        '0px 10px 14px -6px rgba(0,0,0,0.06),0px 22px 35px 3px rgba(0,0,0,0.04),0px 8px 42px 7px rgba(0,0,0,0.02)',
        '0px 11px 14px -7px rgba(0,0,0,0.06),0px 23px 36px 3px rgba(0,0,0,0.04),0px 9px 44px 8px rgba(0,0,0,0.02)',
        '0px 11px 15px -7px rgba(0,0,0,0.06),0px 24px 38px 3px rgba(0,0,0,0.04),0px 9px 46px 8px rgba(0,0,0,0.02)',
    ],
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    scrollbarColor: "#6b6b6b #2b2b2b",
                    "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
                        backgroundColor: "#2b2b2b",
                    },
                    "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
                        borderRadius: 8,
                        backgroundColor: "#6b6b6b",
                        minHeight: 24,
                        border: "3px solid #2b2b2b",
                    },
                    "&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus": {
                        backgroundColor: "#959595",
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '20px',
                    padding: '10px 24px',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    },
                },
                contained: {
                    boxShadow: 'none',
                },
                outlined: {
                    borderWidth: '2px',
                    '&:hover': {
                        borderWidth: '2px',
                    },
                },
                text: {
                    '&:hover': {
                        backgroundColor: alpha(palette.primary.main, 0.08),
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
                    },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        transition: 'all 0.3s ease-in-out',
                        '& fieldset': {
                            borderColor: alpha(palette.text.primary, 0.2),
                            transition: 'border-color 0.3s ease-in-out',
                        },
                        '&:hover fieldset': {
                            borderColor: palette.primary.main,
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: palette.primary.main,
                            borderWidth: '2px',
                        },
                    },
                    '& .MuiInputLabel-root': {
                        transition: 'all 0.3s ease-in-out',
                    },
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    padding: '16px',
                    borderBottom: `1px solid ${alpha(palette.text.primary, 0.1)}`,
                },
                head: {
                    fontWeight: 600,
                    backgroundColor: alpha(palette.primary.main, 0.08),
                    color: palette.text.primary,
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: '16px',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
                    },
                },
            },},
        MuiDialog: {
            styleOverrides: {
                paper: {
                    borderRadius: '12px',
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
                },
            },
        },
        MuiDivider: {
            styleOverrides: {
                root: {
                    margin: '24px 0',
                    backgroundColor: alpha(palette.text.primary, 0.1),
                },
            },
        },
        MuiListItem: {
            styleOverrides: {
                root: {
                    borderRadius: '8px',
                    '&:hover': {
                        backgroundColor: alpha(palette.primary.main, 0.08),
                    },
                },
            },
        },
        MuiSwitch: {
            styleOverrides: {
                root: {
                    width: 42,
                    height: 26,
                    padding: 0,
                    '& .MuiSwitch-switchBase': {
                        padding: 0,
                        margin: 2,
                        transitionDuration: '300ms',
                        '&.Mui-checked': {
                            transform: 'translateX(16px)',
                            color: '#fff',
                            '& + .MuiSwitch-track': {
                                backgroundColor: palette.primary.main,
                                opacity: 1,
                                border: 0,
                            },
                        },
                    },
                    '& .MuiSwitch-thumb': {
                        boxSizing: 'border-box',
                        width: 22,
                        height: 22,
                    },
                    '& .MuiSwitch-track': {
                        borderRadius: 26 / 2,
                        backgroundColor: alpha(palette.text.primary, 0.3),
                        opacity: 1,
                    },
                },
            },
        },
        MuiPagination: {
            styleOverrides: {
                root: {
                    '& .MuiPaginationItem-root': {
                        borderRadius: '8px',
                    },
                },
            },
        },
        MuiAlert: {
            styleOverrides: {
                root: {
                    borderRadius: '8px',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
                },
                standardSuccess: {
                    backgroundColor: alpha(palette.success.main, 0.1),
                    color: palette.success.dark,
                },
                standardError: {
                    backgroundColor: alpha(palette.error.main, 0.1),
                    color: palette.error.dark,
                },
                standardWarning: {
                    backgroundColor: alpha(palette.warning.main, 0.1),
                    color: palette.warning.dark,
                },
                standardInfo: {
                    backgroundColor: alpha(palette.info.main, 0.1),
                    color: palette.info.dark,
                },
            },
        },
    },
    mixins: {
        toolbar: {
            minHeight: 64,
        },
    },
});

// Custom breakpoints
theme.breakpoints.values = {
    xs: 0,
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 1920,
};

// Add responsive font sizes
theme.typography = {
    ...theme.typography,
    h1: {
        ...theme.typography.h1,
        [theme.breakpoints.down('md')]: {
            fontSize: '2.5rem',
        },
    },
    h2: {
        ...theme.typography.h2,
        [theme.breakpoints.down('md')]: {
            fontSize: '2rem',
        },
    },
    h3: {
        ...theme.typography.h3,
        [theme.breakpoints.down('md')]: {
            fontSize: '1.75rem',
        },
    },
};

// Add custom transitions
theme.transitions = {
    ...theme.transitions,
    custom: {
        short: 'all 0.3s ease-in-out',
        medium: 'all 0.5s ease-in-out',
        long: 'all 0.7s ease-in-out',
    },
};

// Add custom z-index values
theme.zIndex = {
    ...theme.zIndex,
    appBar: 1200,
    drawer: 1100,
    modal: 1300,
    snackbar: 1400,
    tooltip: 1500,
};

export default theme;