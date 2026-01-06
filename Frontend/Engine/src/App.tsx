import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoute from './components/PrivateRoute';

import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetails';
import TeamDashboard from './pages/TeamDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Dashboard from './pages/Dashboard';
import ClientDashboard from './pages/ClientDashboard';
import Users from './pages/Users';
import Settings from './pages/Settings';
import AIModule from './pages/AIModule';
import GrowthModule from './pages/GrowthModule';
import LandingPage from './pages/LandingPage';
import ContentModule from './pages/ContentModule';
import OrgSettings from './pages/OrgSettings';
import Billing from './pages/Billing';
import Marketplace from './pages/Marketplace';
import ModuleSettings from './pages/ModuleSettings';

function App() {
  return (
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
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/auth-redirect" element={<Navigate to="/dashboard" replace />} />
          </Route>

          <Route element={<PrivateRoute allowedRoles={['admin', 'employee']} />}>
             <Route path="/team-dashboard" element={<TeamDashboard />} />
          </Route>

          <Route element={<PrivateRoute allowedRoles={['admin']} />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/ai" element={<AIModule />} />
            <Route path="/growth" element={<GrowthModule />} />
            <Route path="/content" element={<ContentModule />} />
            <Route path="/org-settings" element={<OrgSettings />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/module-settings" element={<ModuleSettings />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
