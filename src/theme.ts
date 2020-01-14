import { createMuiTheme } from '@material-ui/core/styles';

// A custom theme for this app
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#fb8c00',
      contrastText: '#fff'
    },
    secondary: {
      main: '#008d23',
    },
    error: {
      main: '#ff5722',
    },
    background: {
      default: '#eee',
    },
  },
});

export default theme;