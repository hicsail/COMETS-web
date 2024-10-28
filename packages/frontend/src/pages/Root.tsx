import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";
import { Outlet, NavLink } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import BookIcon from "@mui/icons-material/Book";
import MailIcon from "@mui/icons-material/Mail";
import InfoIcon from "@mui/icons-material/Info";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { NavbarComponent } from "../components/Navbar";
// import CometsLogo from '../assets/comets_logo.svg';

export function RootLayout() {
  return (
    <>
      <NavbarComponent/>
      <Drawer
        variant="permanent"
        anchor="left"
        PaperProps={{ sx: { backgroundColor: "white" } }}
      >
        <Toolbar />
        <Box sx={{ width: '18vw' }}>
          <List>
            <ListItem disablePadding>
              <ListItemButton component={NavLink} to="/">
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
                <ChevronRightIcon />
              </ListItemButton>
            </ListItem>
          </List>

          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton component={NavLink} to="https://www.runcomets.org/about">
                <ListItemIcon>
                  <InfoIcon />
                </ListItemIcon>
                <ListItemText primary="About Comets" />
                <ChevronRightIcon />
              </ListItemButton>
            </ListItem>
          </List>
          <Divider />

          <List>
            <ListItem disablePadding>
              <ListItemButton component={NavLink} to="https://segrelab.github.io/comets-manual/">
                <ListItemIcon>
                  <BookIcon />
                </ListItemIcon>
                <ListItemText primary="Documentation" />
                <ChevronRightIcon />
              </ListItemButton>
            </ListItem>
          </List>
          <Divider />

          <List>
            <ListItem disablePadding>
              <ListItemButton component={NavLink} to="https://www.runcomets.org/collaborate">
                <ListItemIcon>
                  <MailIcon />
                </ListItemIcon>
                <ListItemText primary="Contact Us" />
                <ChevronRightIcon />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
      <Box
        component="main"
        sx={{
          position: "fixed",
          top: "64px",
          left: "18vw",
          width: "calc(100vw  - 18vw)",
          height: "calc(100vh - 64px)",
          overflow: "auto",
        }}
      >
        <Outlet />
      </Box>
    </>
  );
}
