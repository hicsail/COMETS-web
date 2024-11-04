import { AppBar, Box, Button, Grid, Stack, Toolbar, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";
import { Link } from 'react-router-dom';

export function LandingPage() {
  return (
    <>
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

            <Stack direction="row" spacing={2}>
              <Button
                component={Link}
                to="https://www.runcomets.org/about"
                variant="contained"
                sx={{
                  borderRadius: "20px",
                  backgroundColor: "white",
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
            </Stack>
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
    </>
  );
}
