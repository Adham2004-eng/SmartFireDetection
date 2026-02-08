import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  useTheme,
  useMediaQuery,
  Avatar,
  Chip,
  Divider,
} from '@mui/material';
import {
  Dashboard,
  Home,
  Build,
  Notifications,
  Sensors,
  Logout,
  Menu as MenuIcon,
  LocalFireDepartment,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../types';

const Navigation: React.FC = () => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Don't show navigation for employees or on login page
  if (role === 'employee' || role === null || location.pathname === '/login') {
    return null;
  }

  const menuItems = [
    {
      text: 'Dashboard',
      icon: <Dashboard />,
      path: '/dashboard',
      roles: ['admin', 'security'] as UserRole[],
    },
    {
      text: 'Room Monitoring',
      icon: <Home />,
      path: '/rooms',
      roles: ['admin', 'security'] as UserRole[],
    },
    {
      text: 'Robotic Arm',
      icon: <Build />,
      path: '/robotic-arm',
      roles: ['admin', 'security'] as UserRole[],
    },
    {
      text: 'Alerts & Events',
      icon: <Notifications />,
      path: '/alerts',
      roles: ['admin', 'security'] as UserRole[],
    },
    {
      text: 'Sensors',
      icon: <Sensors />,
      path: '/sensors',
      roles: ['admin', 'security'] as UserRole[],
    },
  ].filter((item) => item.roles.includes(role!));

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      setDrawerOpen(false);
    }
  };

  const drawer = (
    <Box sx={{ width: 280 }}>
      <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <LocalFireDepartment sx={{ fontSize: 40 }} />
          <Typography variant="h6" fontWeight="bold">
            SFF System
          </Typography>
        </Box>
      </Box>
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            {user?.name.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="body1" fontWeight="bold">
              {user?.name}
            </Typography>
            <Chip
              label={role?.toUpperCase()}
              size="small"
              color={role === 'admin' ? 'primary' : 'warning'}
            />
          </Box>
        </Box>
        <Divider sx={{ my: 2 }} />
      </Box>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleNavigation(item.path)}
              sx={{
                '&.Mui-selected': {
                  bgcolor: 'primary.light',
                  color: 'primary.main',
                  '&:hover': {
                    bgcolor: 'primary.light',
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: location.pathname === item.path ? 'primary.main' : 'inherit',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
        <Divider sx={{ my: 1 }} />
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <Logout />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="static"
        elevation={2}
        sx={{
          background: 'linear-gradient(135deg, #f44336 0%, #e91e63 100%)',
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setDrawerOpen(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <LocalFireDepartment sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Smart Fire Fighting
          </Typography>
          {!isMobile && (
            <>
              <Box sx={{ display: 'flex', gap: 1, mr: 3 }}>
                {menuItems.map((item) => (
                  <Button
                    key={item.text}
                    color="inherit"
                    startIcon={item.icon}
                    onClick={() => handleNavigation(item.path)}
                    variant={location.pathname === item.path ? 'outlined' : 'text'}
                    sx={{
                      '&.MuiButton-outlined': {
                        borderColor: 'rgba(255,255,255,0.5)',
                        color: 'white',
                      },
                    }}
                  >
                    {item.text}
                  </Button>
                ))}
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 32, height: 32 }}>
                  {user?.name.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                    {user?.name}
                  </Typography>
                  <Chip
                    label={role?.toUpperCase()}
                    size="small"
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      height: 20,
                      fontSize: '0.65rem',
                    }}
                  />
                </Box>
                <Button
                  color="inherit"
                  startIcon={<Logout />}
                  onClick={handleLogout}
                  sx={{ ml: 1 }}
                >
                  Logout
                </Button>
              </Box>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navigation;
