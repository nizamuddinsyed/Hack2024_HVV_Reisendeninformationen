import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      light: '#FA1D41',
      main: '#FA1D41',
      dark: '#FA1D41',
      contrastText: '#fff',
    },
    secondary: {
      light: '#FA1D41',
      main: '#FA1D41',
      dark: '#FA1D41',
      contrastText: '#000',
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>

    <App />
    </ThemeProvider>
  </React.StrictMode>
);


