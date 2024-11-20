// Navbar.tsx
import { AppBar, Box, IconButton, Toolbar, Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { Dispatch, SetStateAction } from 'react';
import { Menu } from '@mui/icons-material';

export interface NavbarProps {
  drawerOpen: boolean;
  setDrawerOpen: Dispatch<SetStateAction<boolean>>;
}

// Navbar component
export const NavbarComponent: React.FC<NavbarProps> = ({ drawerOpen, setDrawerOpen }) => {
  return (
    <AppBar>
      <Toolbar>
        <IconButton size="large" edge="start" onClick={() => setDrawerOpen(!drawerOpen)}>
          <Menu />
        </IconButton>
        <NavLink to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Box
            component="img"
            src="/comets-logo.jpeg"
            alt="Comets Logo"
            sx={{
              width: 63,
              height: 60,
              position: 'left',
              top: 16,
              left: 20
            }}
          />
        </NavLink>
        <NavLink to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Typography sx={{ fontWeight: 700, paddingLeft: 2, color: 'black' }}>COMETS Smart Interface</Typography>
        </NavLink>
      </Toolbar>
    </AppBar>
  );
};
