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
  TablePagination,
  TextField,
  TableSortLabel,
  Checkbox,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Appointment {
  appointmentId: number;
  patientId: number;
  doctorId: number;
  appointmentDate: string;
  reason: string;
  patientName: string;
  doctorName: string;
  doctorSpecialty: string;
}

const Appointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<
    Appointment[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState<keyof Appointment>("appointmentDate");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const navigate = useNavigate();

  const fetchAppointments = async () => {
    try {
      const response = await axios.get<Appointment[]>(
        "https://localhost:7065/api/v1/appointments"
      );
      setAppointments(response.data);
      setFilteredAppointments(response.data);
      setLoading(false);
    } catch (err) {
      console.error("An error occurred:", err);
      setError("Failed to load appointments.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    const filtered = appointments.filter((a) =>
      a.patientName.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredAppointments(filtered);
  }, [search, appointments]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleEdit = (id: number) => {
    navigate(`/edit-appointment/${id}`);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this appointment?"))
      return;
    try {
      await axios.delete(`https://localhost:7065/api/v1/appointments/${id}`);
      alert("Appointment deleted successfully.");
      fetchAppointments();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete appointment.");
    }
  };

  const handleBulkDelete = async () => {
    if (
      selectedIds.length === 0 ||
      !window.confirm(
        "Are you sure you want to delete the selected appointments?"
      )
    )
      return;

    try {
      await Promise.all(
        selectedIds.map((id) =>
          axios.delete(`https://localhost:7065/api/v1/appointments/${id}`)
        )
      );
      alert("Selected appointments deleted successfully.");
      setSelectedIds([]);
      fetchAppointments();
    } catch (error) {
      console.error("Bulk delete error:", error);
      alert("Failed to delete selected appointments.");
    }
  };

  const handleSort = (property: keyof Appointment) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelectedIds = paginatedAppointments.map((a) => a.appointmentId);
      setSelectedIds((prev) =>
        Array.from(new Set([...prev, ...newSelectedIds]))
      );
    } else {
      const newSelected = selectedIds.filter(
        (id) => !paginatedAppointments.map((a) => a.appointmentId).includes(id)
      );
      setSelectedIds(newSelected);
    }
  };

  const handleCheckboxClick = (id: number) => {
    setSelectedIds((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((selectedId) => selectedId !== id)
        : [...prevSelected, id]
    );
  };

  const isSelected = (id: number) => selectedIds.includes(id);

  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    if (a[orderBy] < b[orderBy]) return order === "asc" ? -1 : 1;
    if (a[orderBy] > b[orderBy]) return order === "asc" ? 1 : -1;
    return 0;
  });

  const paginatedAppointments = sortedAppointments.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const allSelectedOnPage = paginatedAppointments.every((a) =>
    selectedIds.includes(a.appointmentId)
  );

  return (
    <Box p={3} mt={8} mx="0 auto">
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        {/* Left: Title + Search */}
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="h4" gutterBottom>
            Appointments
          </Typography>
          <TextField
            label="Search by Patient Name"
            variant="outlined"
            value={search}
            onChange={handleSearchChange}
            size="small"
          />
        </Stack>

        {/* Right: Action Buttons */}
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/add-appointment")}
          >
            Add Appointment
          </Button>
          {selectedIds.length > 0 && (
            <Button
              variant="contained"
              color="error"
              onClick={handleBulkDelete}
            >
              Delete Selected ({selectedIds.length})
            </Button>
          )}
        </Stack>
      </Stack>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Paper>
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={allSelectedOnPage}
                      onChange={handleSelectAllClick}
                      indeterminate={
                        selectedIds.length > 0 && !allSelectedOnPage
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "appointmentDate"}
                      direction={orderBy === "appointmentDate" ? order : "asc"}
                      onClick={() => handleSort("appointmentDate")}
                    >
                      Date
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Patient</TableCell>
                  <TableCell>Doctor</TableCell>
                  <TableCell>Specialty</TableCell>
                  <TableCell>Reason</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedAppointments.map((appointment) => (
                  <TableRow
                    key={appointment.appointmentId}
                    selected={isSelected(appointment.appointmentId)}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected(appointment.appointmentId)}
                        onChange={() =>
                          handleCheckboxClick(appointment.appointmentId)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(appointment.appointmentDate).toLocaleString()}
                    </TableCell>
                    <TableCell>{appointment.patientName}</TableCell>
                    <TableCell>{appointment.doctorName}</TableCell>
                    <TableCell>{appointment.doctorSpecialty}</TableCell>
                    <TableCell>{appointment.reason}</TableCell>
                    <TableCell align="right">
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="flex-end"
                      >
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleEdit(appointment.appointmentId)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          onClick={() =>
                            handleDelete(appointment.appointmentId)
                          }
                        >
                          Delete
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
                {paginatedAppointments.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No appointments found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={filteredAppointments.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </Paper>
      )}
    </Box>
  );
};

export default Appointments;
