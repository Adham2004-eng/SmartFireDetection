import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Avatar,
  Typography,
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
  LocalFireDepartment,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../types';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  drawerWidth: number;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose, drawerWidth }) => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (role === 'employee' || role === null) {
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
    onClose();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          bgcolor: 'background.paper',
          borderRight: '1px solid rgba(0, 212, 255, 0.1)',
        },
      }}
    >
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              bgcolor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <LocalFireDepartment sx={{ fontSize: 32, color: 'background.default' }} />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight="bold">
              SFF System
            </Typography>
            <Typography variant="caption" color="text.secondary">
              IoT Dashboard
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: 'background.default',
            mb: 3,
            border: '1px solid rgba(0, 212, 255, 0.1)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                bgcolor: 'primary.main',
                width: 48,
                height: 48,
              }}
            >
              {user?.name.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Typography variant="body2" fontWeight="bold" noWrap>
                {user?.name}
              </Typography>
              <Chip
                label={role?.toUpperCase()}
                size="small"
                sx={{
                  mt: 0.5,
                  bgcolor: role === 'admin' ? 'primary.dark' : 'warning.dark',
                  color: 'white',
                  fontSize: '0.65rem',
                  height: 20,
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ borderColor: 'rgba(0, 212, 255, 0.1)' }} />

      <List sx={{ px: 2, pt: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleNavigation(item.path)}
              sx={{
                borderRadius: 2,
                '&.Mui-selected': {
                  bgcolor: 'primary.dark',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'white',
                  },
                },
                '&:hover': {
                  bgcolor: 'rgba(0, 212, 255, 0.1)',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: location.pathname === item.path ? 'white' : 'text.secondary',
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: location.pathname === item.path ? 600 : 400,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Box sx={{ mt: 'auto', p: 2 }}>
        <Divider sx={{ borderColor: 'rgba(0, 212, 255, 0.1)', mb: 2 }} />
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
            '&:hover': {
              bgcolor: 'rgba(255, 107, 107, 0.1)',
            },
          }}
        >
          <ListItemIcon sx={{ color: 'error.main', minWidth: 40 }}>
            <Logout />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </Box>
    </Drawer>
  );
};

export default Sidebar;

