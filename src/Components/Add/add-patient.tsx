import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface PatientInput {
  name: string;
  age: number;
  gender: string;
  address: string;
  email: string;
  mobile: string;
  registrationNumber: string;
  isActive: boolean;
  doctorId: string; // new field for doctor selection
}

interface Doctor {
  id: string;
  name: string;
}

const AddPatient: React.FC = () => {
  const navigate = useNavigate();

  const [patient, setPatient] = useState<PatientInput>({
    name: "",
    age: 0,
    gender: "Male",
    address: "",
    email: "",
    mobile: "",
    registrationNumber: "",
    isActive: true,
    doctorId: "",
  });

  const [doctors, setDoctors] = useState<Doctor[]>([]);

  // Fetch doctors on mount
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(
          "https://localhost:7065/api/v1/Doctors"
        );
        setDoctors(response.data);
      } catch (error) {
        console.error("Failed to fetch doctors:", error);
      }
    };
    fetchDoctors();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setPatient({ ...patient, [name]: value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPatient({ ...patient, isActive: e.target.checked });
  };

  const handleSubmit = async () => {
    try {
      await axios.post("https://localhost:7065/api/v1/Patients", patient);
      alert("Patient added successfully!");
      navigate("/patients");
    } catch (error) {
      console.error("Add error:", error);
      alert("Failed to add patient.");
    }
  };

  return (
    <Box p={3} maxWidth="600px" margin="0 auto">
      <Typography variant="h5" gutterBottom>
        Add Patient
      </Typography>

      <TextField
        fullWidth
        margin="normal"
        label="Name"
        name="name"
        value={patient.name}
        onChange={handleChange}
      />
      <TextField
        fullWidth
        margin="normal"
        label="Age"
        name="age"
        type="number"
        value={patient.age}
        onChange={handleChange}
      />
      <TextField
        fullWidth
        margin="normal"
        label="Gender"
        name="gender"
        select
        value={patient.gender}
        onChange={handleChange}
      >
        <MenuItem value="Male">Male</MenuItem>
        <MenuItem value="Female">Female</MenuItem>
        <MenuItem value="Other">Other</MenuItem>
      </TextField>

      <TextField
        fullWidth
        margin="normal"
        label="Doctor"
        name="doctorId"
        select
        value={patient.doctorId}
        onChange={handleChange}
        required
      >
        <MenuItem value="">
          <em>Select Doctor</em>
        </MenuItem>
        {doctors.map((doc) => (
          <MenuItem key={doc.id} value={doc.id}>
            {doc.name}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        fullWidth
        margin="normal"
        label="Mobile"
        name="mobile"
        value={patient.mobile}
        onChange={handleChange}
      />
      <TextField
        fullWidth
        margin="normal"
        label="Email"
        name="email"
        type="email"
        value={patient.email}
        onChange={handleChange}
      />
      <TextField
        fullWidth
        margin="normal"
        label="Address"
        name="address"
        value={patient.address}
        onChange={handleChange}
      />
      <TextField
        fullWidth
        margin="normal"
        label="Registration Number"
        name="registrationNumber"
        value={patient.registrationNumber}
        onChange={handleChange}
      />

      <FormControlLabel
        control={
          <Checkbox
            checked={patient.isActive}
            onChange={handleCheckboxChange}
            name="isActive"
          />
        }
        label="Active"
      />

      <Box mt={2}>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Save
        </Button>
        <Button
          variant="text"
          color="secondary"
          onClick={() => navigate("/patients")}
          style={{ marginLeft: "10px" }}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default AddPatient;
