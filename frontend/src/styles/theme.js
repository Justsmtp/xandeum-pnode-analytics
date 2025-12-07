// frontend/src/styles/theme.js

export const theme = {
  colors: {
    // Nigerian Green & White Theme
    primary: {
      main: '#008751',        // Nigerian Green
      light: '#00A860',
      dark: '#006B3F',
      lighter: '#E8F5E9',
    },
    secondary: {
      main: '#FFFFFF',        // Pure White
      light: '#F5F5F5',
      dark: '#E0E0E0',
    },
    accent: {
      green: '#4CAF50',
      mint: '#00C853',
      emerald: '#00796B',
    },
    status: {
      active: '#4CAF50',
      gossiping: '#00C853',
      offline: '#9E9E9E',
      warning: '#FF9800',
      error: '#F44336',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
      light: '#FFFFFF',
      muted: '#BDBDBD',
    },
    background: {
      main: '#FFFFFF',
      secondary: '#F5F5F5',
      card: '#FFFFFF',
      hover: '#E8F5E9',
    },
    border: {
      light: '#E0E0E0',
      main: '#BDBDBD',
      green: '#008751',
    },
  },
  
  typography: {
    fontFamily: {
      primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      mono: "'Fira Code', 'Courier New', monospace",
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
  },
  
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px',
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    green: '0 4px 14px 0 rgba(0, 135, 81, 0.25)',
  },
};