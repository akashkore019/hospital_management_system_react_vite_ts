import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  Alert,
  CircularProgress,
  MenuItem,
  Paper,
  Divider,
} from "@mui/material";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

interface Appointment {
  appointmentId: number;
  patientName: string;
  doctorName: string;
  doctorSpecialty: string;
  appointmentDate: string;
  reason: string;
}

interface Doctor {
  id: string;
  name: string;
  specialty: string;
}

const EditAppointment: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appointmentRes, doctorsRes] = await Promise.all([
          axios.get<Appointment>(
            `https://localhost:7065/api/v1/appointments/${id}`
          ),
          axios.get<Doctor[]>(`https://localhost:7065/api/v1/doctors`),
        ]);

        setAppointment(appointmentRes.data);
        setDoctors(doctorsRes.data);

        const matchedDoctor = doctorsRes.data.find(
          (doc) => doc.name === appointmentRes.data.doctorName
        );
        if (matchedDoctor) {
          setSelectedDoctorId(matchedDoctor.id);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!appointment) return;
    setAppointment({ ...appointment, [e.target.name]: e.target.value });
  };

  const handleDoctorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const doctorId = e.target.value;
    const selectedDoctor = doctors.find((doc) => doc.id === doctorId);
    setSelectedDoctorId(doctorId);

    if (appointment && selectedDoctor) {
      setAppointment({
        ...appointment,
        doctorName: selectedDoctor.name,
        doctorSpecialty: selectedDoctor.specialty,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !appointment?.patientName ||
      !appointment.doctorName ||
      !appointment.doctorSpecialty ||
      !appointment.appointmentDate ||
      !appointment.reason
    ) {
      setError("Please fill in all fields.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await axios.put(
        `https://localhost:7065/api/v1/appointments/${id}`,
        appointment
      );
      alert("Appointment updated successfully.");
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Failed to update appointment.");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );

  if (!appointment)
    return (
      <Box p={3} mt={8}>
        <Alert severity="error">Appointment not found.</Alert>
      </Box>
    );

  return (
    <Box p={3} mt={6} display="flex" justifyContent="center">
      <Paper elevation={3} sx={{ p: 4, maxWidth: 600, width: "100%" }}>
        <Typography variant="h5" gutterBottom>
          Edit Appointment
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              label="Patient Name"
              name="patientName"
              value={appointment.patientName}
              onChange={handleChange}
              fullWidth
              required
            />

            <TextField
              label="Select Doctor"
              select
              value={selectedDoctorId}
              onChange={handleDoctorChange}
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
              name="appointmentDate"
              type="datetime-local"
              value={appointment.appointmentDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
            />

            <TextField
              label="Reason for Visit"
              name="reason"
              value={appointment.reason}
              onChange={handleChange}
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
                disabled={saving}
              >
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={saving}>
                {saving ? <CircularProgress size={24} /> : "Save Changes"}
              </Button>
            </Stack>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};

export default EditAppointment;
