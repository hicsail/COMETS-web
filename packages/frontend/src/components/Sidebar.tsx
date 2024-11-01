import { Book, ChevronRight, Home, Info, Mail } from "@mui/icons-material";
import { Drawer, ListItemButton, ListItemIcon, ListItemText, ListItem, List } from "@mui/material";
import { ReactNode } from "react";
import { NavLink } from "react-router-dom";

interface SidebarProps {
  open: boolean;
  drawerWidth: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ open, drawerWidth }) => {

  const navItems: NavItemProps[] = [
    {
      text: 'Dashboard',
      icon: <Home />,
      link: '/'
    },
    {
      text: 'About Comets',
      icon: <Info />,
      link: 'https://www.runcomets.org/about'
    },
    {
      text: 'Documentation',
      icon: <Book />,
      link: 'https://segrelab.github.io/comets-manual/'
    },
    {
      text: 'Contact Us',
      icon: <Mail />,
      link: 'https://www.runcomets.org/collaborate'
    },
  ];

  return (
    <Drawer
      variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#103F68',
            color: 'white',
            paddingTop: 2,
            paddingBottom: 10,
            mt: '64px'
          }
        }}
        anchor="left"
        open={open}
    >
      <List sx={{ paddingTop: '30px' }}>
        {navItems.map((item => <NavItem {...item} />))}
      </List>
    </Drawer>
  );
};

interface NavItemProps {
  text: string;
  link: string;
  icon: ReactNode;
}

const NavItem: React.FC<NavItemProps> = ({ icon, link, text }) => {
  return (
    <ListItem>
      <ListItemButton component={NavLink} to={link} >
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={text} />
        <ChevronRight />
      </ListItemButton>
    </ListItem>
  );
};
