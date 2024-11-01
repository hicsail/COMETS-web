import {
  Box,
} from '@mui/material';
import { Outlet } from 'react-router-dom';
import { NavbarComponent } from '../components/Navbar';
import { useState } from 'react';
import { Sidebar } from '../components/Sidebar';

export const RootLayout: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(true);

  return (
    <>
      <NavbarComponent drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />
      <Sidebar open={drawerOpen} drawerWidth={256} />
      <Box
        component='main'
        sx={{
          position: 'fixed',
          top: '64px',
          left: '18vw',
          width: 'calc(100vw  - 18vw)',
          height: 'calc(100vh - 64px)',
          overflow: 'auto',
        }}
      >
        <Outlet />
      </Box>
    </>
  );
}
