import React, { useState } from 'react';
import {
  Menu,
  MenuItem,
  IconButton,
  Badge,
  Typography,
  Box,
  Chip,
  Divider,
  Card,
  CardContent,
  Avatar,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  Notifications,
  LocalFireDepartment,
  Warning,
  CheckCircle,
  Close,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useAlerts } from '../context/AlertContext';
import type { Alert } from '../types';

const NotificationMenu: React.FC = () => {
  const { alerts, acknowledgeAlert, getUnacknowledgedAlerts } = useAlerts();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const unacknowledgedAlerts = getUnacknowledgedAlerts();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAlertClick = (alert: Alert) => {
    handleClose();
    navigate('/alerts');
  };

  const handleAcknowledge = (e: React.MouseEvent, alertId: string) => {
    e.stopPropagation();
    acknowledgeAlert(alertId);
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'fire':
        return <LocalFireDepartment sx={{ fontSize: 24, color: 'error.main' }} />;
      case 'high-risk-object':
        return <Warning sx={{ fontSize: 24, color: 'warning.main' }} />;
      default:
        return null;
    }
  };

  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleClick}
        sx={{
          color: 'text.secondary',
          '&:hover': {
            bgcolor: 'rgba(0, 212, 255, 0.1)',
          },
        }}
      >
        <Badge badgeContent={unacknowledgedAlerts.length} color="error">
          <Notifications />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 400,
            maxHeight: 600,
            bgcolor: 'background.paper',
            border: '1px solid rgba(0, 212, 255, 0.2)',
            mt: 1.5,
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ p: 2, pb: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight="bold">
              Notifications
            </Typography>
            <Chip
              label={unacknowledgedAlerts.length}
              color="error"
              size="small"
              sx={{ fontWeight: 'bold' }}
            />
          </Box>
        </Box>
        <Divider sx={{ borderColor: 'rgba(0, 212, 255, 0.1)' }} />
        <Box sx={{ maxHeight: 500, overflow: 'auto' }}>
          {unacknowledgedAlerts.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <CheckCircle sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
              <Typography variant="body2" color="text.secondary">
                No new notifications
              </Typography>
            </Box>
          ) : (
            unacknowledgedAlerts.slice(0, 5).map((alert) => (
              <MenuItem
                key={alert.id}
                onClick={() => handleAlertClick(alert)}
                sx={{
                  py: 1.5,
                  px: 2,
                  '&:hover': {
                    bgcolor: 'rgba(0, 212, 255, 0.05)',
                  },
                }}
              >
                <ListItemIcon>
                  <Avatar
                    sx={{
                      bgcolor: alert.type === 'fire' ? 'error.main' : 'warning.main',
                      width: 40,
                      height: 40,
                    }}
                  >
                    {getAlertIcon(alert.type)}
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Typography variant="body2" fontWeight="bold">
                        {alert.title}
                      </Typography>
                      <Chip
                        label={alert.type === 'fire' ? 'FIRE' : 'RISK'}
                        color={alert.type === 'fire' ? 'error' : 'warning'}
                        size="small"
                        sx={{ height: 18, fontSize: '0.65rem' }}
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        {alert.message}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {format(new Date(alert.timestamp), 'MMM dd, HH:mm')}
                      </Typography>
                    </Box>
                  }
                />
                <IconButton
                  size="small"
                  onClick={(e) => handleAcknowledge(e, alert.id)}
                  sx={{
                    ml: 1,
                    color: 'text.secondary',
                    '&:hover': {
                      bgcolor: 'rgba(255, 71, 87, 0.1)',
                      color: 'error.main',
                    },
                  }}
                >
                  <Close fontSize="small" />
                </IconButton>
              </MenuItem>
            ))
          )}
        </Box>
        {unacknowledgedAlerts.length > 5 && (
          <>
            <Divider sx={{ borderColor: 'rgba(0, 212, 255, 0.1)' }} />
            <MenuItem
              onClick={() => {
                handleClose();
                navigate('/alerts');
              }}
              sx={{
                justifyContent: 'center',
                py: 1.5,
                '&:hover': {
                  bgcolor: 'rgba(0, 212, 255, 0.05)',
                },
              }}
            >
              <Typography variant="body2" color="primary">
                View All Alerts
              </Typography>
            </MenuItem>
          </>
        )}
      </Menu>
    </>
  );
};

export default NotificationMenu;

