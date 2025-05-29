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
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState<keyof Patient>("name");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const navigate = useNavigate();

  const fetchPatients = async () => {
    try {
      const response = await axios.get<Patient[]>(
        "https://localhost:7065/api/v1/Patients"
      );
      setPatients(response.data);
      setFilteredPatients(response.data);
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

  useEffect(() => {
    const filtered = patients.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredPatients(filtered);
  }, [search, patients]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

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

  const handleBulkDelete = async () => {
    if (
      selectedIds.length === 0 ||
      !window.confirm("Are you sure you want to delete the selected patients?")
    )
      return;

    try {
      await Promise.all(
        selectedIds.map((id) =>
          axios.delete(`https://localhost:7065/api/v1/Patients/${id}`)
        )
      );
      alert("Selected patients deleted successfully.");
      setSelectedIds([]);
      fetchPatients();
    } catch (error) {
      console.error("Bulk delete error:", error);
      alert("Failed to delete selected patients.");
    }
  };

  const handleSort = (property: keyof Patient) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelectedIds = paginatedPatients.map((p) => p.patientId);
      setSelectedIds((prev) => Array.from(new Set([...prev, ...newSelectedIds])));
    } else {
      const newSelected = selectedIds.filter(
        (id) => !paginatedPatients.map((p) => p.patientId).includes(id)
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

  const sortedPatients = [...filteredPatients].sort((a, b) => {
    if (a[orderBy] < b[orderBy]) return order === "asc" ? -1 : 1;
    if (a[orderBy] > b[orderBy]) return order === "asc" ? 1 : -1;
    return 0;
  });

  const paginatedPatients = sortedPatients.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const allSelectedOnPage = paginatedPatients.every((p) => selectedIds.includes(p.patientId));

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Patients
      </Typography>

      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <TextField
          label="Search by Name"
          variant="outlined"
          value={search}
          onChange={handleSearchChange}
          size="small"
        />
        <Stack direction="row" spacing={2}>
          <Button variant="contained" color="primary" onClick={() => navigate("/add-patient")}>
            Add Patient
          </Button>
          {selectedIds.length > 0 && (
            <Button variant="contained" color="error" onClick={handleBulkDelete}>
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
                      active={orderBy === "name"}
                      direction={orderBy === "name" ? order : "asc"}
                      onClick={() => handleSort("name")}
                    >
                      Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Mobile</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "gender"}
                      direction={orderBy === "gender" ? order : "asc"}
                      onClick={() => handleSort("gender")}
                    >
                      Gender
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "age"}
                      direction={orderBy === "age" ? order : "asc"}
                      onClick={() => handleSort("age")}
                    >
                      Age
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedPatients.map((patient) => (
                  <TableRow key={patient.patientId} selected={isSelected(patient.patientId)}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected(patient.patientId)}
                        onChange={() => handleCheckboxClick(patient.patientId)}
                      />
                    </TableCell>
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
                {paginatedPatients.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No patients found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={filteredPatients.length}
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

export default Patients;
