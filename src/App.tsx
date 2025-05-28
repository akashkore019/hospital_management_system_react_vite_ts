import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/dashboard';
import Patients from './pages/patient';
import Doctor from './pages/Doctor';
import Appointments from './pages/Appointments';
import Settings from './pages/Settings';
import Sidebar from './components/sidebar';
import Header from './components/header';
import EditPatient from './pages/edit-patient';
import AddPatient from './pages/add-patient';
import EditDoctor from './pages/edit-doctor';
import AddDoctor from './pages/add-doctor';
import { Box } from '@mui/material';

const App = () => {
  return (
    <Router>
      <Box display="flex">
        <Sidebar />
        <Box flex={1}>
          <Header />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/patients" element={<Patients />} />
          <Route path="/Doctor" element={<Doctor />} />

            <Route path="/appointments" element={<Appointments />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/edit-patient/:id" element={<EditPatient />} />
            <Route path="/add-patient" element={<AddPatient />} />
            <Route path="/edit-doctor/:id" element={<EditDoctor />} />
            <Route path="/add-doctor" element={<AddDoctor />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
};

export default App;
