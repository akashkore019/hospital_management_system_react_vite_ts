import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './Components/Pages/Dashboard';
import Patients from './Components/Pages/Patient';
import Doctor from './Components/Pages/Doctor';
import Appointments from './Components/Pages/Appointments';
import Sidebar from './Layout/sidebar';
import Header from './Layout/header';
import EditPatient from './Components/Update/edit-patient';
import AddPatient from './Components/Add/add-patient';
import EditDoctor from './Components/Update/edit-doctor';
import AddDoctor from './Components/Add/add-doctor';
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
