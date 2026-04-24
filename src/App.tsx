import { Suspense } from 'react';

import CssBaseline from '@mui/material/CssBaseline';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import { Outlet } from 'react-router-dom';

import { theme } from './theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Suspense fallback={null}>
        <Outlet />
      </Suspense>
    </ThemeProvider>
  );
}

export default App;
