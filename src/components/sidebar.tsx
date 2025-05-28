import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Box,
  Typography,
} from "@mui/material";
import {
  Dashboard,
  People,
  CalendarMonth,
  Settings,
} from "@mui/icons-material";
import { Link } from "react-router-dom";

interface MenuItem {
  text: string;
  icon: React.ReactNode;
  path: string;
}

const menuItems: MenuItem[] = [
  { text: "Dashboard", icon: <Dashboard />, path: "/" },
  { text: "Patients", icon: <People />, path: "/patients" },
  { text: "Doctors", icon: <People />, path: "/doctor" },
  { text: "Appointments", icon: <CalendarMonth />, path: "/appointments" },
  { text: "Settings", icon: <Settings />, path: "/settings" },
];

const Sidebar: React.FC = () => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 240,
          boxSizing: "border-box",
          backgroundColor: "#1e1e2f",
          color: "#ffffff",
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" fontWeight="bold" color="white">
          Health Portal
        </Typography>
      </Box>
      <List>
        {menuItems.map((item, index) => (
          <ListItem disablePadding key={index}>
            <ListItemButton
              component={Link}
              to={item.path}
              sx={{
                "&:hover": {
                  backgroundColor: "#2a2a3d",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: "inherit",
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.2)",
                  },
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{ fontSize: 14 }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
