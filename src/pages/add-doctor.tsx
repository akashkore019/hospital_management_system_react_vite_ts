import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddDoctor: React.FC = () => {
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState({
    name: "",
    specialization: "",
    registrationNumber: "",
    email: "",
    mobile: "",
    isActive: true,
    departmentId: 1, // Default department
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDoctor({ ...doctor, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      await axios.post("https://localhost:7065/api/v1/doctors", doctor);
      alert("Doctor added successfully!");
      navigate("/doctors");
    } catch (err) {
      console.error("Add error:", err);
      alert("Failed to add doctor.");
    }
  };

  return (
    <Box p={3} maxWidth="600px" margin="0 auto">
      <Typography variant="h5" gutterBottom>
        Add Doctor
      </Typography>

      <TextField
        fullWidth
        margin="normal"
        label="Name"
        name="name"
        value={doctor.name}
        onChange={handleChange}
      />
      <TextField
        fullWidth
        margin="normal"
        label="Specialization"
        name="specialization"
        value={doctor.specialization}
        onChange={handleChange}
      />
      <TextField
        fullWidth
        margin="normal"
        label="Mobile"
        name="mobile"
        value={doctor.mobile}
        onChange={handleChange}
      />
      <TextField
        fullWidth
        margin="normal"
        label="Email"
        name="email"
        type="email"
        value={doctor.email}
        onChange={handleChange}
      />
      <TextField
        fullWidth
        margin="normal"
        label="Registration Number"
        name="registrationNumber"
        value={doctor.registrationNumber}
        onChange={handleChange}
      />
      <TextField
        fullWidth
        margin="normal"
        label="Department"
        name="departmentId"
        select
        value={doctor.departmentId}
        onChange={handleChange}
      >
        <MenuItem value={1}>Cardiology</MenuItem>
        <MenuItem value={2}>Neurology</MenuItem>
        <MenuItem value={3}>Dentist</MenuItem>
      </TextField>

      <Box mt={2}>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Add
        </Button>
        <Button
          variant="text"
          color="secondary"
          onClick={() => navigate("/doctors")}
          style={{ marginLeft: "10px" }}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default AddDoctor;
