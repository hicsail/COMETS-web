import { AppBar, Box, Button, Grid, Toolbar, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Link } from 'react-router-dom';


const navbarTheme = createTheme({
  typography: {
    fontFamily: "Inter",
    fontSize: 20,
  },
});

export function LandingPage() {
  return (
    <div>
      <ThemeProvider theme={navbarTheme}>
        <AppBar
          component="nav"
          color="default"
          position="fixed"
          elevation={0}
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1,
            backgroundColor: "#FEFEFE",
          }}
        >
          <Toolbar>
            <NavLink
              to="/"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Box
                component="img"
                src="/comets-logo.jpeg"
                alt="Comets Logo"
                sx={{
                  width: 63,
                  height: 60,
                  position: "left",
                  top: 16,
                  left: 20,
                }}
              />
            </NavLink>
            <NavLink
              to="/"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Typography sx={{ fontWeight: 700, paddingLeft: 2 }}>
                COMETS Smart Interface
              </Typography>
            </NavLink>
          </Toolbar>
        </AppBar>
      </ThemeProvider>

      <Box
        sx={{
          pt: "64px",
          height: "100vh - 64px",
          width: "100vw",
          overflow: "auto",
        }}
      >
        <Grid container spacing={0} sx={{ height: "100vh" }}>
          <Grid
            item
            xs={6}
            sx={{
              display: "flex",
            }}
          >
            <Box
              sx={{
                width: "100%",
                paddingTop: "25%",
                paddingRight: "10%",
                paddingLeft: "10%",
              }}
            >
              <Typography
                sx={{
                  textAlign: "left",
                  fontFamily: "Open Sans",
                  fontSize: "46px",
                  color: "black",
                  fontWeight: "700",
                  lineHeight: "110%",
                  paddingBottom: "2.5%",
                }}
              >
                COMETS = Biology + Physics
              </Typography>
              <Typography
                sx={{
                  textAlign: "left",
                  paddingBottom: "10%",
                  color: "black",
                  fontWeight: "500",
                  opacity: "45%",
                }}
              >
                COMETS (Computation Of Microbial Ecosystems in Time and Space) simulates the dynamics of microbial communities, for example bacterial colonies on a Petri dish, or microbial communities in soil. COMETS works by combining predictions of metabolic reaction rates (fluxes) in each organism, with biophysical calculations of the spreading of cells and molecules through diffusion.
              {" "}
              </Typography>
              <Typography
                sx={{
                  textAlign: "left",
                  fontFamily: "Open Sans",
                  fontSize: "30px",
                  color: "black",
                  fontWeight: "700",
                  lineHeight: "110%",
                  paddingBottom: "2.5%",
                }}
              >
                Run microbiology experiments in a virtual lab
              </Typography>
              <Typography
                sx={{
                  textAlign: "left",
                  color: "black",
                  fontWeight: "500",
                  fontSize: "16px",
                  paddingBottom: "5%",
                }}
              >
                COMETS is written in Java and is freely available. To facilitate access, we have developed the browser-based COMETS Smart Interface (COMETS-SI).

              </Typography>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Button
                  component={Link}
                  to="https://www.runcomets.org/about"
                  variant="contained"
                  sx={{
                    borderRadius: "20px",
                    backgroundColor: "white",
                    color: "primary.main",
                    border: "none",
                    height: "10vh",
                    width: "18vw",
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: "white",
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: "Work Sans",
                      fontWeight: 600,
                      fontSize: "16px",
                      color: "black",
                    }}
                  >
                    About COMETS
                  </Typography>
                </Button>
                <NavLink to="/dashboard">
                  <Button
                    variant="contained"
                    href="/"
                    sx={{
                      borderRadius: "20px",
                      backgroundColor: "white",
                      color: "primary.main",
                      border: "none",
                      height: "10vh",
                      width: "18vw",
                      textTransform: "none",
                      "&:hover": {
                        backgroundColor: "white",
                      },
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: "Work Sans",
                        fontWeight: 600,
                        fontSize: "16px",
                        color: "black",
                      }}
                    >
                      Explore COMETS SI
                    </Typography>
                  </Button>
                </NavLink>
              </Box>
            </Box>
          </Grid>

          <Grid
            item
            xs={6}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden",
            }}
          >
            <Box sx={{ width: "100%" }}>
              <Box
                component="img"
                src="../../landing.png"
                alt="Comets Logo"
                sx={{
                  width: "100%", // ensures the image covers the width of the grid item
                  height: "100vh", // ensures the image covers the height of the grid item
                  objectFit: "cover", // scales the image to maintain its aspect ratio, cropping it to fit the container
                  objectPosition: "center", // adjusts the position of the image within its frame
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}
