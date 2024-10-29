// Navbar.tsx
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
} from "@mui/material";
import { NavLink } from "react-router-dom";

// Navbar component
export const NavbarComponent = () => {
  return (
    <>
      <AppBar
        component="nav"
        color="default"
        position="fixed"
        elevation={0}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "#FEFEFE",
          height: "64px",
        }}
      >
        <Toolbar>
          <NavLink to="/" style={{ textDecoration: "none", color: "inherit" }}>
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
          <NavLink to="/" style={{ textDecoration: "none", color: "inherit" }}>
            <Typography sx={{ fontWeight: 700, paddingLeft: 2 }}>
              COMETS Smart Interface
            </Typography>
          </NavLink>
        </Toolbar>
      </AppBar>
    </>
  );
};
