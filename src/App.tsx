
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import { AlertProvider } from './context/AlertContext';
import { iotTheme } from './theme/iotTheme';
import DashboardLayout from './components/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import RoomMonitoringPage from './pages/RoomMonitoringPage';
import RoboticArmPage from './pages/RoboticArmPage';
import AlertsPage from './pages/AlertsPage';
import SensorsPage from './pages/SensorsPage';
import EmployeeViewPage from './pages/EmployeeViewPage';

function App() {
  return (
    <ThemeProvider theme={iotTheme}>
      <CssBaseline />
      <AuthProvider>
        <AlertProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'security']}>
                    <DashboardLayout>
                      <DashboardPage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/rooms"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'security']}>
                    <DashboardLayout>
                      <RoomMonitoringPage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/robotic-arm"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'security']}>
                    <DashboardLayout>
                      <RoboticArmPage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/alerts"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'security']}>
                    <DashboardLayout>
                      <AlertsPage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/sensors"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'security']}>
                    <DashboardLayout>
                      <SensorsPage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/employee"
                element={
                  <ProtectedRoute allowedRoles={['employee']}>
                    <EmployeeViewPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
          </BrowserRouter>
        </AlertProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
