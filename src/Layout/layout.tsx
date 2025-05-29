import React from "react";
import { Box } from "@mui/material";
import Header from "./header";
import Sidebar from "./sidebar";
import { motion } from "framer-motion";

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
        component={motion.main}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
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
