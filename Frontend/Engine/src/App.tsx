import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { SocketProvider } from "./context/SocketContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PrivateRoute from "./components/PrivateRoute";

import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import TeamDashboard from "./pages/TeamDashboard";
import Tasks from "./pages/Tasks";
import AdminDashboard from "./pages/AdminDashboard";
import Dashboard from "./pages/Dashboard";
import ClientDashboard from "./pages/ClientDashboard";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import LandingPage from "./pages/LandingPage";
import OrgSettings from "./pages/OrgSettings";
import Chat from "./pages/Chat";
import Invoices from "./pages/Invoices";
import Billing from "./pages/Billing"; // New import
import ModuleSettings from "./pages/ModuleSettings"; // New import

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SocketProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<LandingPage />} />

              {/* Protected Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin-dashboard"
                element={
                  <PrivateRoute roles={["admin"]}>
                    <AdminDashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/team-dashboard"
                element={
                  <PrivateRoute roles={["admin", "employee"]}>
                    <TeamDashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/client-dashboard"
                element={
                  <PrivateRoute roles={["client"]}>
                    <ClientDashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/projects"
                element={
                  <PrivateRoute>
                    <Projects />
                  </PrivateRoute>
                }
              />
              <Route
                path="/projects/:id"
                element={
                  <PrivateRoute>
                    <ProjectDetails />
                  </PrivateRoute>
                }
              />
              <Route
                path="/tasks"
                element={
                  <PrivateRoute roles={["admin", "employee"]}>
                    <Tasks />
                  </PrivateRoute>
                }
              />
              <Route
                path="/chat"
                element={
                  <PrivateRoute>
                    <Chat />
                  </PrivateRoute>
                }
              />
              <Route
                path="/invoices"
                element={
                  <PrivateRoute roles={["admin", "client"]}>
                    <Invoices />
                  </PrivateRoute>
                }
              />
              <Route
                path="/billing"
                element={
                  <PrivateRoute roles={["admin", "client"]}>
                    <Billing />
                  </PrivateRoute>
                }
              />
              <Route
                path="/users"
                element={
                  <PrivateRoute roles={["admin"]}>
                    <Users />
                  </PrivateRoute>
                }
              />
              <Route
                path="/org-settings"
                element={
                  <PrivateRoute roles={["admin"]}>
                    <OrgSettings />
                  </PrivateRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <PrivateRoute>
                    <Settings />
                  </PrivateRoute>
                }
              />
              <Route
                path="/module-settings"
                element={
                  <PrivateRoute roles={["admin"]}>
                    <ModuleSettings />
                  </PrivateRoute>
                }
              />
            </Routes>
          </Router>
        </SocketProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
