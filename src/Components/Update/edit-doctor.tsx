import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

interface Doctor {
  doctorId: number;
  name: string;
  specialization: string;
  registrationNumber: string;
  email: string;
  mobile: string;
  isActive: boolean;
  departmentId: number;
  departmentName: string;
}

const EditDoctor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDoctor = async () => {
    try {
      const response = await axios.get<Doctor>(
        `https://localhost:7065/api/v1/doctors/${id}`
      );
      setDoctor(response.data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch doctor data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctor();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!doctor) return;
    const { name, value } = e.target;
    setDoctor({ ...doctor, [name]: value });
  };

  const handleSubmit = async () => {
    if (!doctor) return;
    try {
      await axios.put(
        `https://localhost:7065/api/v1/doctors/${doctor.doctorId}`,
        doctor
      );
      alert("Doctor updated successfully!");
      navigate("/doctors");
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update doctor.");
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box p={3} maxWidth="600px" margin="0 auto">
      <Typography variant="h5" gutterBottom>
        Edit Doctor
      </Typography>

      {doctor && (
        <>
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
            name="departmentName"
            value={doctor.departmentName}
            onChange={handleChange}
            disabled
          />
          <Box mt={2}>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Update
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
        </>
      )}
    </Box>
  );
};

export default EditDoctor;
