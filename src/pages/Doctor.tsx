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

const Doctors: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState<keyof Doctor>("name");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const navigate = useNavigate();

  const fetchDoctors = async () => {
    try {
      const response = await axios.get<Doctor[]>("https://localhost:7065/api/v1/doctors");
      setDoctors(response.data);
      setFilteredDoctors(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load doctors.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    const filtered = doctors.filter((d) =>
      d.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredDoctors(filtered);
  }, [search, doctors]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleEdit = (id: number) => {
    navigate(`/edit-doctor/${id}`);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this doctor?")) return;
    try {
      await axios.delete(`https://localhost:7065/api/v1/doctors/${id}`);
      alert("Doctor deleted successfully.");
      fetchDoctors();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete doctor.");
    }
  };

  const handleBulkDelete = async () => {
    if (
      selectedIds.length === 0 ||
      !window.confirm("Are you sure you want to delete selected doctors?")
    )
      return;

    try {
      await Promise.all(
        selectedIds.map((id) =>
          axios.delete(`https://localhost:7065/api/v1/doctors/${id}`)
        )
      );
      alert("Selected doctors deleted successfully.");
      setSelectedIds([]);
      fetchDoctors();
    } catch (error) {
      console.error("Bulk delete error:", error);
      alert("Failed to delete selected doctors.");
    }
  };

  const handleSort = (property: keyof Doctor) => {
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
      const newSelected = paginatedDoctors.map((d) => d.doctorId);
      setSelectedIds((prev) => Array.from(new Set([...prev, ...newSelected])));
    } else {
      const newSelected = selectedIds.filter(
        (id) => !paginatedDoctors.map((d) => d.doctorId).includes(id)
      );
      setSelectedIds(newSelected);
    }
  };

  const handleCheckboxClick = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const isSelected = (id: number) => selectedIds.includes(id);

  const sortedDoctors = [...filteredDoctors].sort((a, b) => {
    if (a[orderBy] < b[orderBy]) return order === "asc" ? -1 : 1;
    if (a[orderBy] > b[orderBy]) return order === "asc" ? 1 : -1;
    return 0;
  });

  const paginatedDoctors = sortedDoctors.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const allSelectedOnPage = paginatedDoctors.every((d) => selectedIds.includes(d.doctorId));

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Doctors
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
          <Button variant="contained" color="primary" onClick={() => navigate("/add-doctor")}>
            Add Doctor
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
                      indeterminate={selectedIds.length > 0 && !allSelectedOnPage}
                      onChange={handleSelectAllClick}
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
                  <TableCell>Email</TableCell>
                  <TableCell>Mobile</TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "specialization"}
                      direction={orderBy === "specialization" ? order : "asc"}
                      onClick={() => handleSort("specialization")}
                    >
                      Specialization
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedDoctors.map((doctor) => (
                  <TableRow key={doctor.doctorId} selected={isSelected(doctor.doctorId)}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected(doctor.doctorId)}
                        onChange={() => handleCheckboxClick(doctor.doctorId)}
                      />
                    </TableCell>
                    <TableCell>{doctor.name}</TableCell>
                    <TableCell>{doctor.email}</TableCell>
                    <TableCell>{doctor.mobile}</TableCell>
                    <TableCell>{doctor.specialization}</TableCell>
                    <TableCell>{doctor.departmentName}</TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleEdit(doctor.doctorId)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          onClick={() => handleDelete(doctor.doctorId)}
                        >
                          Delete
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
                {paginatedDoctors.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No doctors found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={filteredDoctors.length}
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

export default Doctors;
