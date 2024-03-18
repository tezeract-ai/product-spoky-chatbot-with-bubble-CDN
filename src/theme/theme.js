import { createTheme, responsiveFontSizes } from "@mui/material/styles";

let theme = createTheme({
  palette: {
    primary: {
      main: "#FF8C7D",
      contrastText: "#111827",
    },
  },
  typography: {
    button: {
      textTransform: "none",
    },
    // fontFamily:[  'Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont',  'Roboto', "Helvetica Neue", 'Arial', 'sans-serif',].join(','),
  },
  breakpoints: {
    keys: [
      "xs",
      "xssm",
      "sm",
      "smmd",
      "md",
      "mdlg",
      "lg",
      "lgxl",
      "xl",
      "xxl",
      "xxll",
    ],
    values: {
      xs: 0,
      xssm: 440,
      sm: 600,
      smmd: 750,
      md: 900,
      mdlg: 1000,
      lg: 1200,
      lgxl: 1400,
      xl: 1600,
      xxl: 1800,
      xxll: 1920,
      xxlll: 4098,
    },
  },
});

theme = responsiveFontSizes(theme);
export default theme;
