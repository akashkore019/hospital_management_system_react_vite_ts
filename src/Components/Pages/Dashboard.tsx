import React from "react";
import { Box, Typography, Grid, Paper, Avatar, useTheme } from "@mui/material";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PeopleIcon from "@mui/icons-material/People";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";

const StatCard = ({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}) => {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderRadius: 2,
        height: "100%",
      }}
    >
      <Box>
        <Typography variant="subtitle2" color="textSecondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4" fontWeight="bold">
          {value}
        </Typography>
      </Box>
      <Avatar sx={{ bgcolor: color, width: 56, height: 56 }}>{icon}</Avatar>
    </Paper>
  );
};

const Dashboard = () => {
  const theme = useTheme();

  return (
    <Box p={3} mt={8} mx="0 auto">
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Hospital Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Patients"
            value={120}
            icon={<PeopleIcon />}
            color={theme.palette.primary.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Appointments Today"
            value={45}
            icon={<CalendarTodayIcon />}
            color={theme.palette.secondary.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Doctors"
            value={12}
            icon={<MedicalServicesIcon />}
            color={theme.palette.success.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Departments"
            value={8}
            icon={<LocalHospitalIcon />}
            color={theme.palette.warning.main}
          />
        </Grid>
      </Grid>

      {/* Future sections for charts, recent activity, etc. */}
      <Box mt={5}>
        <Typography variant="h6" gutterBottom>
          Upcoming Features
        </Typography>
        <Paper sx={{ p: 3, textAlign: "center", color: "text.secondary" }}>
          Charts, recent activity, analytics, and more coming soon!
        </Paper>
      </Box>
    </Box>
  );
};

export default Dashboard;
