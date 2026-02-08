import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  InputAdornment,
} from '@mui/material';
import {
  Person,
  Lock,
  LocalFireDepartment,
  Login as LoginIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [particles, setParticles] = useState<Array<{ x: number; y: number; size: number; speed: number }>>([]);

  // Generate animated particles
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = Array.from({ length: 50 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 1,
        speed: Math.random() * 0.5 + 0.2,
      }));
      setParticles(newParticles);
    };

    generateParticles();
    const interval = setInterval(() => {
      setParticles((prev) =>
        prev.map((p) => ({
          ...p,
          y: p.y > 100 ? 0 : p.y + p.speed,
          x: p.x + Math.sin(p.y * 0.1) * 0.2,
        }))
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(id.trim(), password);

    if (result.success) {
      const { mockUsers } = await import('../mockData/mockUsers');
      const user = mockUsers.find((u) => u.id === id.trim());
      
      if (user?.role === 'employee') {
        navigate('/employee');
      } else {
        navigate('/dashboard');
      }
    } else {
      setError(result.error || 'Login failed');
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0a0e27 0%, #151b3d 50%, #0a0e27 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated Background Particles */}
      <Box
        sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          zIndex: 0,
        }}
      >
        {particles.map((particle, index) => (
          <Box
            key={index}
            sx={{
              position: 'absolute',
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
              borderRadius: '50%',
              background: 'rgba(0, 212, 255, 0.3)',
              boxShadow: '0 0 10px rgba(0, 212, 255, 0.5)',
              animation: 'float 3s ease-in-out infinite',
              animationDelay: `${index * 0.1}s`,
              '@keyframes float': {
                '0%, 100%': { transform: 'translateY(0px)' },
                '50%': { transform: 'translateY(-20px)' },
              },
            }}
          />
        ))}
      </Box>

      {/* Animated Grid Background */}
      <Box
        sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backgroundImage: `
            linear-gradient(rgba(0, 212, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 212, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'gridMove 20s linear infinite',
          '@keyframes gridMove': {
            '0%': { transform: 'translate(0, 0)' },
            '100%': { transform: 'translate(50px, 50px)' },
          },
          zIndex: 0,
        }}
      />

      {/* Animated Gradient Orbs */}
      <Box
        sx={{
          position: 'absolute',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 212, 255, 0.2) 0%, transparent 70%)',
          top: '-300px',
          left: '-300px',
          animation: 'orbit 20s linear infinite',
          '@keyframes orbit': {
            '0%': { transform: 'rotate(0deg) translateX(200px) rotate(0deg)' },
            '100%': { transform: 'rotate(360deg) translateX(200px) rotate(-360deg)' },
          },
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 71, 87, 0.15) 0%, transparent 70%)',
          bottom: '-200px',
          right: '-200px',
          animation: 'orbit 25s linear infinite reverse',
          zIndex: 0,
        }}
      />

      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1, px: { xs: 2, sm: 3 } }}>
        <Paper
          elevation={24}
          sx={{
            p: 5,
            borderRadius: 4,
            background: 'rgba(21, 27, 61, 0.95)',
            border: '1px solid rgba(0, 212, 255, 0.3)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 8px 32px rgba(0, 212, 255, 0.2)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #00d4ff, #ff4757, #00d4ff)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 3s linear infinite',
              '@keyframes shimmer': {
                '0%': { backgroundPosition: '0% 50%' },
                '100%': { backgroundPosition: '200% 50%' },
              },
            },
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                display: 'inline-flex',
                p: 2,
                borderRadius: 3,
                bgcolor: 'primary.main',
                mb: 2,
                animation: 'pulse 2s ease-in-out infinite',
                '@keyframes pulse': {
                  '0%, 100%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(0, 212, 255, 0.7)' },
                  '50%': { transform: 'scale(1.05)', boxShadow: '0 0 0 10px rgba(0, 212, 255, 0)' },
                },
              }}
            >
              <LocalFireDepartment sx={{ fontSize: 48, color: 'background.default' }} />
            </Box>
            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
              Smart Fire Fighting
            </Typography>
            <Typography variant="body2" color="text.secondary">
              IoT Monitoring System
            </Typography>
          </Box>

          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                bgcolor: 'rgba(255, 71, 87, 0.1)',
                border: '1px solid rgba(255, 71, 87, 0.3)',
                color: 'error.main',
              }}
            >
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="User ID"
              value={id}
              onChange={(e) => setId(e.target.value)}
              margin="normal"
              required
              autoComplete="username"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  transition: 'all 0.3s',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.08)',
                    borderColor: 'primary.main',
                  },
                  '&.Mui-focused': {
                    bgcolor: 'rgba(255, 255, 255, 0.08)',
                    borderColor: 'primary.main',
                  },
                },
              }}
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              autoComplete="current-password"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  transition: 'all 0.3s',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.08)',
                    borderColor: 'primary.main',
                  },
                  '&.Mui-focused': {
                    bgcolor: 'rgba(255, 255, 255, 0.08)',
                    borderColor: 'primary.main',
                  },
                },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              startIcon={<LoginIcon />}
              sx={{
                py: 1.5,
                bgcolor: 'primary.main',
                fontWeight: 'bold',
                fontSize: '1rem',
                transition: 'all 0.3s',
                '&:hover': {
                  bgcolor: 'primary.dark',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 16px rgba(0, 212, 255, 0.3)',
                },
                '&:disabled': {
                  bgcolor: 'rgba(0, 212, 255, 0.3)',
                },
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </Box>

          <Box
            sx={{
              mt: 4,
              p: 2,
              bgcolor: 'rgba(0, 212, 255, 0.05)',
              borderRadius: 2,
              border: '1px solid rgba(0, 212, 255, 0.2)',
            }}
          >
            <Typography variant="caption" fontWeight="bold" display="block" gutterBottom color="primary">
              Demo Credentials:
            </Typography>
            <Typography variant="caption" display="block" color="text.secondary" sx={{ mb: 0.5 }}>
              Admin: ADMIN001 / admin123
            </Typography>
            <Typography variant="caption" display="block" color="text.secondary" sx={{ mb: 0.5 }}>
              Security: SEC001 / security123
            </Typography>
            <Typography variant="caption" display="block" color="text.secondary">
              Employee: EMP001 / emp123
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;
