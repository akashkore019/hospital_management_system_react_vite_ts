import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
  Alert,
  MenuItem,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import config from "../config";

interface Patient {
  patientId: number;
  name: string;
  age: number;
  gender: string;
  address: string;
  email: string;
  mobile: string;
  registrationNumber: string;
  isActive: boolean;
}

const EditPatient: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPatient = async () => {
    try {
    const response = await axios.get(`${config.apiUrl}Patients/${id}`);
      setPatient(response.data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch patient data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatient();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!patient) return;
    const { name, value } = e.target;
    setPatient({ ...patient, [name]: value });
  };

  const handleSubmit = async () => {
    if (!patient) return;
    try {
      await axios.put(`https://localhost:7065/api/v1/Patients/${patient.patientId}`, patient);
      alert("Patient updated successfully!");
      navigate("/patients");
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update patient.");
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box p={3} maxWidth="600px" margin="0 auto">
      <Typography variant="h5" gutterBottom>
        Edit Patient
      </Typography>

      {patient && (
        <>
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
          <Box mt={2}>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Update
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
        </>
      )}
    </Box>
  );
};

export default EditPatient;
