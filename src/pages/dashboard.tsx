import React from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";

const Dashboard = () => {
  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Hospital Dashboard 
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6">Patients</Typography>
            <Typography variant="h4">120</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6">Appointments</Typography>
            <Typography variant="h4">45</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
