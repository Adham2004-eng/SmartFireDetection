import React, { useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Chip,
  Stack,
  Divider,
} from '@mui/material';
import {
  LocalFireDepartment,
  ExitToApp,
  CheckCircle,
  Warning,
  DirectionsRun,
  Map,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useAlerts } from '../context/AlertContext';
import { useNavigate } from 'react-router-dom';

const EmployeeViewPage: React.FC = () => {
  const { role, logout } = useAuth();
  const { hasFireAlert } = useAlerts();
  const navigate = useNavigate();

  const fireDetected = hasFireAlert();

  useEffect(() => {
    // Redirect if not employee
    if (role !== 'employee') {
      navigate('/dashboard');
    }
  }, [role, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const fireContent = (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <LocalFireDepartment
          sx={{
            fontSize: 140,
            color: '#ff3b30',
            animation: 'pulseFire 1.2s infinite',
            '@keyframes pulseFire': {
              '0%,100%': { transform: 'scale(1)', filter: 'drop-shadow(0 0 12px rgba(255,59,48,0.6))' },
              '50%': { transform: 'scale(1.06)', filter: 'drop-shadow(0 0 18px rgba(255,59,48,0.9))' },
            },
          }}
        />
      </Box>
      <Typography variant="h2" fontWeight="bold" align="center" sx={{ mb: 1 }}>
        FIRE ALERT
      </Typography>
      <Typography variant="h6" color="text.secondary" align="center" sx={{ mb: 3 }}>
        🔴 Evacuate immediately. Do not use elevators.
      </Typography>
      <Stack spacing={2} sx={{ mb: 3 }}>
        <Paper variant="outlined" sx={{ p: 2, bgcolor: 'rgba(255,59,48,0.08)', borderColor: 'rgba(255,59,48,0.4)' }}>
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
            Immediate Actions
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • Stop work and move calmly to the nearest exit.<br />
            • Assist others if safe to do so.<br />
            • Close doors behind you; do not lock.
          </Typography>
        </Paper>
        <Paper variant="outlined" sx={{ p: 2, bgcolor: 'rgba(255,165,0,0.08)', borderColor: 'rgba(255,165,0,0.4)' }}>
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
            Assembly Point
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Proceed to the main parking lot assembly area and await further instructions.
          </Typography>
        </Paper>
      </Stack>
      <Stack direction="row" spacing={2} justifyContent="center">
        <Button
          variant="contained"
          color="error"
          size="large"
          startIcon={<DirectionsRun />}
          sx={{ px: 3 }}
        >
          Evacuate Now
        </Button>
        <Button
          variant="outlined"
          color="inherit"
          size="large"
          startIcon={<Map />}
          sx={{ px: 3 }}
        >
          View Exits (Mock)
        </Button>
      </Stack>
    </>
  );

  const safeContent = (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <CheckCircle sx={{ fontSize: 120, color: 'success.main' }} />
      </Box>
      <Typography variant="h3" fontWeight="bold" align="center" sx={{ mb: 1 }}>
        All Clear
      </Typography>
      <Typography variant="h6" color="text.secondary" align="center" sx={{ mb: 3 }}>
        No active fire alerts. Continue normal activities.
      </Typography>
      <Paper variant="outlined" sx={{ p: 2, bgcolor: 'rgba(46,213,115,0.08)', borderColor: 'rgba(46,213,115,0.4)', mb: 3 }}>
        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
          Safety Reminder
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Keep exits clear. Report hazards to Security. Stay aware of posted evacuation routes.
        </Typography>
      </Paper>
    </>
  );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: fireDetected
          ? 'radial-gradient(circle at 20% 20%, rgba(255,59,48,0.15), transparent 35%), radial-gradient(circle at 80% 30%, rgba(255,165,0,0.12), transparent 30%), #0a0e27'
          : 'radial-gradient(circle at 20% 20%, rgba(0,212,255,0.12), transparent 35%), radial-gradient(circle at 80% 30%, rgba(46,213,115,0.12), transparent 30%), #0a0e27',
        transition: 'background 0.4s ease',
        p: { xs: 2, md: 4 },
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={12}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 4,
            position: 'relative',
            overflow: 'hidden',
            border: `2px solid ${fireDetected ? 'rgba(255,59,48,0.4)' : 'rgba(0,212,255,0.25)'}`,
            background: fireDetected
              ? 'linear-gradient(135deg, rgba(255,59,48,0.18), rgba(255,165,0,0.08))'
              : 'linear-gradient(135deg, rgba(0,212,255,0.12), rgba(46,213,115,0.08))',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Chip
              icon={fireDetected ? <Warning /> : <CheckCircle />}
              label={fireDetected ? 'FIRE ALERT' : 'ALL CLEAR'}
              color={fireDetected ? 'error' : 'success'}
              sx={{ fontWeight: 'bold' }}
            />
            <Button
              variant="text"
              color="inherit"
              startIcon={<ExitToApp />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Box>

          {fireDetected ? fireContent : safeContent}

          <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.1)' }} />

          <Typography variant="caption" color="text.secondary">
            This is a demo view for employees. In a real deployment, exit maps, floor beacons, and PA
            guidance would appear here.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default EmployeeViewPage;

