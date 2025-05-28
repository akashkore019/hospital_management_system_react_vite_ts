import React from "react";
import { Box } from "@mui/material";
import Header from "./Header";
import Sidebar from "./Sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

const drawerWidth = 240;
const appBarHeight = 64;

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Header />
      <Sidebar />
      <Box
        component="main"
        sx={{
          marginLeft: `${drawerWidth}px`,
          marginTop: `${appBarHeight}px`,
          padding: 3,
          minHeight: `calc(100vh - ${appBarHeight}px)`,
          backgroundColor: "#f9f9f9",
        }}
      >
        {children}
      </Box>
    </>
  );
};

export default Layout;
