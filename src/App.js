import React from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import EnterprisePerformanceDashboard from './components/EnterprisePerformanceDashboard';
import theme from './theme';

function App() {
  return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <EnterprisePerformanceDashboard />
      </ThemeProvider>
  );
}

export default App;