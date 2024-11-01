import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";


export interface ThemeProviderProps {
  children: React.ReactNode;
}

export const CometsThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const theme = createTheme({
    typography: {
      h1: {
        fontSize: 50
      },
      h2: {
        fontSize: 40
      },
      h3: {
        fontSize: 18
      }
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: 'white'
          }
        }
      }
    }
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
