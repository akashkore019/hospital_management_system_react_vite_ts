import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  Alert,
  CircularProgress,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
}

const AddAppointment: React.FC = () => {
  const [patientName, setPatientName] = useState("");
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [reason, setReason] = useState("");
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(
          "https://localhost:7065/api/v1/doctors"
        );
        setDoctors(response.data);
      } catch (err) {
        console.error("Failed to fetch doctors:", err);
      }
    };

    fetchDoctors();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const selectedDoctor = doctors.find((doc) => doc.id === selectedDoctorId);

    if (!patientName || !selectedDoctor || !appointmentDate || !reason) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await axios.post("https://localhost:7065/api/v1/appointments", {
        patientName,
        doctorName: selectedDoctor.name,
        doctorSpecialty: selectedDoctor.specialty,
        appointmentDate,
        reason,
      });

      alert("Appointment added successfully.");
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Failed to add appointment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={3} mt={8} maxWidth={600} mx="auto">
      <Typography variant="h4" gutterBottom>
        Add Appointment
      </Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="Patient Name"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            fullWidth
            required
          />

          <TextField
            label="Select Doctor"
            select
            value={selectedDoctorId}
            onChange={(e) => setSelectedDoctorId(e.target.value)}
            fullWidth
            required
          >
            <MenuItem value="">
              <em>Select a doctor</em>
            </MenuItem>
            {doctors.map((doc) => (
              <MenuItem key={doc.id} value={doc.id}>
                {doc.name} — {doc.specialty}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Appointment Date and Time"
            type="datetime-local"
            value={appointmentDate}
            onChange={(e) => setAppointmentDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
            required
          />

          <TextField
            label="Reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            multiline
            rows={3}
            fullWidth
            required
          />

          {error && <Alert severity="error">{error}</Alert>}

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              variant="outlined"
              onClick={() => navigate("/")}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : "Add"}
            </Button>
          </Stack>
        </Stack>
      </form>
    </Box>
  );
};

export default AddAppointment;
