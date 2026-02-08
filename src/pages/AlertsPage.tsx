import React from 'react';
import {
  Typography,
  Box,
  Chip,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Alert as MuiAlert,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from '@mui/lab';
import {
  LocalFireDepartment,
  Warning,
  CheckCircle,
  AccessTime,
  LocationOn,
  FiberManualRecord,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useAlerts } from '../context/AlertContext';
import type { Alert } from '../types';

const AlertsPage: React.FC = () => {
  const { alerts, acknowledgeAlert } = useAlerts();

  const handleAcknowledge = (alertId: string) => {
    acknowledgeAlert(alertId);
  };

  const unacknowledgedAlerts = alerts.filter((a) => !a.acknowledged);
  const acknowledgedAlerts = alerts.filter((a) => a.acknowledged).slice(0, 10);

  const AlertCard: React.FC<{ alert: Alert; isActive?: boolean }> = ({ alert, isActive = false }) => {
    const isFire = alert.type === 'fire';
    
    return (
      <Card
        sx={{
          mb: 2,
          background: isFire
            ? 'linear-gradient(135deg, rgba(255, 71, 87, 0.15) 0%, rgba(255, 71, 87, 0.05) 100%)'
            : 'linear-gradient(135deg, rgba(255, 165, 2, 0.15) 0%, rgba(255, 165, 2, 0.05) 100%)',
          border: `2px solid ${isFire ? 'rgba(255, 71, 87, 0.3)' : 'rgba(255, 165, 2, 0.3)'}`,
          transition: 'all 0.3s',
          '&:hover': {
            transform: 'translateX(4px)',
            borderColor: isFire ? 'rgba(255, 71, 87, 0.6)' : 'rgba(255, 165, 2, 0.6)',
          },
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'start', gap: 2 }}>
            <Avatar
              sx={{
                bgcolor: isFire ? 'error.main' : 'warning.main',
                width: 56,
                height: 56,
              }}
            >
              {isFire ? (
                <LocalFireDepartment sx={{ fontSize: 32 }} />
              ) : (
                <Warning sx={{ fontSize: 32 }} />
              )}
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                <Typography variant="h6" fontWeight="bold">
                  {alert.title}
                </Typography>
                <Chip
                  label={isFire ? 'FIRE' : 'HIGH RISK'}
                  color={isFire ? 'error' : 'warning'}
                  size="small"
                  sx={{ fontWeight: 'bold' }}
                />
                {!isActive && (
                  <Chip
                    icon={<CheckCircle />}
                    label="Acknowledged"
                    color="success"
                    size="small"
                  />
                )}
              </Box>
              <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                {alert.message}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <LocationOn fontSize="small" color="primary" />
                  <Typography variant="caption" color="text.secondary">
                    {alert.roomName}
                  </Typography>
                </Box>
                {alert.quadrantNumber && (
                  <Chip
                    label={`Q${alert.quadrantNumber}`}
                    size="small"
                    variant="outlined"
                  />
                )}
                {alert.detectedObject && (
                  <Chip
                    label={alert.detectedObject}
                    size="small"
                    variant="outlined"
                    color="warning"
                  />
                )}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 'auto' }}>
                  <AccessTime fontSize="small" sx={{ color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary">
                    {format(new Date(alert.timestamp), 'MMM dd, HH:mm')}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </CardContent>
        {alert.cameraSnapshot && (
          <CardMedia
            component="img"
            height="200"
            image={alert.cameraSnapshot}
            alt="Camera snapshot"
            sx={{ 
              objectFit: 'cover', 
              opacity: isActive ? 1 : 0.7,
              borderTop: '1px solid rgba(255, 71, 87, 0.2)',
            }}
          />
        )}
        {isActive && (
          <CardActions>
            <Button
              size="small"
              variant="contained"
              color="primary"
              onClick={() => handleAcknowledge(alert.id)}
              sx={{ ml: 1, mb: 1 }}
            >
              Acknowledge
            </Button>
          </CardActions>
        )}
      </Card>
    );
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Alerts & Events
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Real-time alert monitoring and event history
        </Typography>
      </Box>

      {unacknowledgedAlerts.length > 0 && (
        <MuiAlert
          severity="warning"
          icon={<Warning />}
          sx={{
            mb: 3,
            bgcolor: 'rgba(255, 165, 2, 0.1)',
            border: '1px solid rgba(255, 165, 2, 0.3)',
            color: 'warning.main',
          }}
        >
          <strong>{unacknowledgedAlerts.length}</strong> unacknowledged alert(s) require immediate attention
        </MuiAlert>
      )}

      <Grid container spacing={3}>
        {/* Active Alerts */}
        <Grid item xs={12} md={7}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" fontWeight="bold">
                  Active Alerts
                </Typography>
                <Chip
                  label={unacknowledgedAlerts.length}
                  color="error"
                  sx={{ fontWeight: 'bold' }}
                />
              </Box>
              {unacknowledgedAlerts.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No active alerts
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    All systems operating normally
                  </Typography>
                </Box>
              ) : (
                unacknowledgedAlerts.map((alert) => (
                  <AlertCard key={alert.id} alert={alert} isActive />
                ))
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Timeline */}
        <Grid item xs={12} md={5}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Recent Events
              </Typography>
              <Timeline sx={{ mt: 2 }}>
                {acknowledgedAlerts.slice(0, 5).map((alert, index) => (
                  <React.Fragment key={alert.id}>
                    <TimelineItem>
                      <TimelineSeparator>
                        <TimelineDot
                          color={alert.type === 'fire' ? 'error' : 'warning'}
                          variant="outlined"
                        >
                          {alert.type === 'fire' ? (
                            <LocalFireDepartment fontSize="small" />
                          ) : (
                            <Warning fontSize="small" />
                          )}
                        </TimelineDot>
                        {index < acknowledgedAlerts.length - 1 && <TimelineConnector />}
                      </TimelineSeparator>
                      <TimelineContent>
                        <Typography variant="body2" fontWeight="bold">
                          {alert.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {alert.roomName} • {format(new Date(alert.timestamp), 'MMM dd, HH:mm')}
                        </Typography>
                      </TimelineContent>
                    </TimelineItem>
                  </React.Fragment>
                ))}
              </Timeline>
            </CardContent>
          </Card>

          {/* Alert Statistics */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Alert Statistics
              </Typography>
              <Box sx={{ mt: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Fire Alerts
                  </Typography>
                  <Typography variant="body2" fontWeight="bold" color="error.main">
                    {alerts.filter((a) => a.type === 'fire').length}
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2, borderColor: 'rgba(255,255,255,0.1)' }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    High-Risk Objects
                  </Typography>
                  <Typography variant="body2" fontWeight="bold" color="warning.main">
                    {alerts.filter((a) => a.type === 'high-risk-object').length}
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2, borderColor: 'rgba(255,255,255,0.1)' }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Total Alerts
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {alerts.length}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AlertsPage;
