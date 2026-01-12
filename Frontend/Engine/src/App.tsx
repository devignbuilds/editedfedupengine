import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoute from './components/PrivateRoute';

import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetails';
import TeamDashboard from './pages/TeamDashboard';
import Tasks from './pages/Tasks';
import AdminDashboard from './pages/AdminDashboard';
import Dashboard from './pages/Dashboard';
import ClientDashboard from './pages/ClientDashboard';
import Users from './pages/Users';
import Settings from './pages/Settings';
import LandingPage from './pages/LandingPage';
import OrgSettings from './pages/OrgSettings';
import Chat from './pages/Chat';
import Invoices from './pages/Invoices';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/client-dashboard" element={<ClientDashboard />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:id" element={<ProjectDetails />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/invoices" element={<Invoices />} />
              {/* Billing removed per scope */}
            </Route>

            <Route element={<PrivateRoute allowedRoles={['admin', 'employee']} />}>
               <Route path="/team-dashboard" element={<TeamDashboard />} />
               <Route path="/tasks" element={<Tasks />} />
            </Route>

            <Route element={<PrivateRoute allowedRoles={['admin']} />}>
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/users" element={<Users />} />
              <Route path="/org-settings" element={<OrgSettings />} />
              {/* ModuleSettings removed per scope */}
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
