import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Stack,
  CircularProgress,
  Alert,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Updated Patient Interface
interface Patient {
  patientId: number;
  name: string;
  mobile: string;
  email: string;
  address: string;
  gender: string;
  age: number;
  registrationNumber: string;
  isActive: boolean;
}

const Patients: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchPatients = async () => {
    try {
      const response = await axios.get<Patient[]>(
        "https://localhost:7065/api/v1/Patients"
      );
      setPatients(response.data);
      setLoading(false);
    } catch (err) {
      console.error("An error occurred:", err);
      setError("Failed to load patients.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleEdit = (id: number) => {
    navigate(`/edit-patient/${id}`);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this patient?")) return;
    try {
      await axios.delete(`https://localhost:7065/api/v1/Patients/${id}`);
      alert("Patient deleted successfully.");
      fetchPatients();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete patient.");
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Patients
      </Typography>

      <Box mb={2}>
        <Button variant="contained" color="primary" onClick={() => navigate("/add-patient")}>
          Add Patient
        </Button>
      </Box>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
              <TableRow>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Mobile</strong></TableCell>
                <TableCell><strong>Email</strong></TableCell>
                <TableCell><strong>Gender</strong></TableCell>
                <TableCell><strong>Age</strong></TableCell>
                <TableCell align="right"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {patients.map((patient) => (
                <TableRow key={patient.patientId}>
                  <TableCell>{patient.name}</TableCell>
                  <TableCell>{patient.mobile}</TableCell>
                  <TableCell>{patient.email}</TableCell>
                  <TableCell>{patient.gender}</TableCell>
                  <TableCell>{patient.age}</TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleEdit(patient.patientId)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => handleDelete(patient.patientId)}
                      >
                        Delete
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
              {patients.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No patients found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default Patients;
