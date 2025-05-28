import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/dashboard';
import Patients from './pages/patient';
import Appointments from './pages/Appointments';
import Settings from './pages/Settings';
import Sidebar from './components/sidebar';
import Header from './components/Header';
import EditPatient from './pages/edit-patient';
import AddPatient from './pages/add-patient';
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
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/edit-patient/:id" element={<EditPatient />} />
<Route path="/add-patient" element={<AddPatient />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
};

export default App;
