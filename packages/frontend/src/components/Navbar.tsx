// Navbar.tsx
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import { Dispatch, SetStateAction } from 'react';

export interface NavbarProps {
  drawerOpen: boolean;
  setDrawerOpen: Dispatch<SetStateAction<boolean>>;
}

// Navbar component
export const NavbarComponent: React.FC<NavbarProps> = ({ drawerOpen, setDrawerOpen }) => {
  return (
    <AppBar>
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
  );
};
