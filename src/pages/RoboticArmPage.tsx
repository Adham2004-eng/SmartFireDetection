import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  LinearProgress,
} from '@mui/material';
import { Build, PlayArrow, Stop, LocationOn } from '@mui/icons-material';
import type { RoboticArm } from '../types';
import { mockRoboticArm } from '../mockData/mockRoboticArm';
import { useAlerts } from '../context/AlertContext';
import { mockRooms } from '../mockData/mockRooms';

const RoboticArmPage: React.FC = () => {
  const [arm, setArm] = useState<RoboticArm>(mockRoboticArm);
  const { alerts } = useAlerts();

  const activeFireAlert = alerts.find(
    (alert) => alert.type === 'fire' && !alert.acknowledged
  );

  useEffect(() => {
    if (activeFireAlert && activeFireAlert.quadrantNumber) {
      const targetRoom = mockRooms.find((r) => r.id === activeFireAlert.roomId);
      if (targetRoom) {
        const targetQuadrant = targetRoom.quadrants.find(
          (q) => q.number === activeFireAlert.quadrantNumber
        );
        if (targetQuadrant) {
          setArm((prevArm) => ({
            ...prevArm,
            targetQuadrant: {
              roomId: activeFireAlert.roomId,
              quadrantNumber: activeFireAlert.quadrantNumber!,
            },
            currentPosition: targetQuadrant.coordinates,
            status: 'suppressing',
            lastAction: `Fire suppression activated in ${activeFireAlert.roomName}, Quadrant ${activeFireAlert.quadrantNumber}`,
            lastActionTime: new Date().toISOString(),
          }));
        }
      }
    } else {
      setArm((prevArm) => ({
        ...prevArm,
        status: 'idle',
        targetQuadrant: undefined,
      }));
    }
  }, [alerts, activeFireAlert]);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'suppressing':
        return {
          color: 'error',
          bg: 'linear-gradient(135deg, rgba(255, 71, 87, 0.15) 0%, rgba(255, 71, 87, 0.05) 100%)',
          border: 'rgba(255, 71, 87, 0.3)',
        };
      case 'moving':
        return {
          color: 'warning',
          bg: 'linear-gradient(135deg, rgba(255, 165, 2, 0.15) 0%, rgba(255, 165, 2, 0.05) 100%)',
          border: 'rgba(255, 165, 2, 0.3)',
        };
      default:
        return {
          color: 'success',
          bg: 'linear-gradient(135deg, rgba(46, 213, 115, 0.15) 0%, rgba(46, 213, 115, 0.05) 100%)',
          border: 'rgba(46, 213, 115, 0.3)',
        };
    }
  };

  const statusConfig = getStatusConfig(arm.status);

  const Visualization: React.FC = () => {
    const room = activeFireAlert
      ? mockRooms.find((r) => r.id === activeFireAlert.roomId)
      : mockRooms[0];

    const targetQuadrantNumber = activeFireAlert?.quadrantNumber ?? arm.targetQuadrant?.quadrantNumber;

    return (
      <Box
        sx={{
          width: '100%',
          aspectRatio: '1 / 1',
          minHeight: { xs: 300, sm: 400, md: 420 },
          maxHeight: { xs: 400, sm: 500, md: 520 },
          border: '2px solid',
          borderColor: 'primary.main',
          borderRadius: 3,
          position: 'relative',
          bgcolor: 'background.default',
          overflow: 'hidden',
          boxShadow: 4,
        }}
      >
        {/* Four quadrants use the entire box (no gaps) */}
        {[1, 2, 3, 4].map((num) => {
          const quadrant = room.quadrants.find((q) => q.number === num);
          const isFire = quadrant?.status === 'fire';
          const isTarget = targetQuadrantNumber === num;

          // Position: Q1 top-left, Q2 top-right, Q3 bottom-left, Q4 bottom-right
          const top = num <= 2 ? '0%' : '50%';
          const left = num === 1 || num === 3 ? '0%' : '50%';

          return (
            <Box
              key={num}
              sx={{
                position: 'absolute',
                top,
                left,
                width: '50%',
                height: '50%',
                bgcolor: isFire
                  ? 'rgba(255, 71, 87, 0.18)'
                  : isTarget && arm.status !== 'idle'
                  ? 'rgba(255, 165, 2, 0.15)'
                  : 'transparent',
                borderRight: num === 1 || num === 3 ? '1px solid rgba(0, 212, 255, 0.3)' : 'none',
                borderBottom: num === 1 || num === 2 ? '1px solid rgba(0, 212, 255, 0.3)' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s',
              }}
            >
              {/* Quadrant label */}
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" fontWeight="bold">
                  Q{num}
                </Typography>
                {isFire && (
                  <Chip
                    label="FIRE"
                    color="error"
                    size="small"
                    sx={{ mt: 1, fontWeight: 'bold' }}
                  />
                )}
              </Box>

              {/* Target highlight ring */}
              {isTarget && arm.status !== 'idle' && (
                <Box
                  sx={{
                    position: 'absolute',
                    inset: '10%',
                    borderRadius: 3,
                    border: '2px dashed rgba(255, 165, 2, 0.9)',
                    animation: 'targetPulse 1.6s infinite',
                    pointerEvents: 'none',
                    '@keyframes targetPulse': {
                      '0%, 100%': { opacity: 0.4 },
                      '50%': { opacity: 1 },
                    },
                  }}
                />
              )}
            </Box>
          );
        })}

        {/* Status banner at bottom */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            bgcolor: 'rgba(10, 14, 39, 0.95)',
            p: 1.5,
            borderTop: '1px solid rgba(0, 212, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: 2,
          }}
        >
          <Typography variant="body2" fontWeight="bold">
            {arm.status === 'idle'
              ? '🟢 Arm idle – no active fire targets.'
              : `🔴 Arm ${arm.status.toUpperCase()} – Target: ${activeFireAlert?.roomName ??
                  room.name}, Q${targetQuadrantNumber ?? '-'}`}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Base at X: {arm.currentPosition.x}, Y: {arm.currentPosition.y}, Z: {arm.currentPosition.z}
          </Typography>
        </Box>
      </Box>
    );
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Robotic Arm Control
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Real-time arm position and fire suppression status
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 2 }}>
                Arm Visualization
              </Typography>
              <Visualization />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card
            sx={{
              mb: 2,
              background: statusConfig.bg,
              border: `2px solid ${statusConfig.border}`,
            }}
          >
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Arm Status
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Chip
                  icon={arm.status === 'idle' ? <Stop /> : <PlayArrow />}
                  label={arm.status.toUpperCase()}
                  color={statusConfig.color as any}
                  sx={{ mb: 2, fontSize: '1rem', height: 32, fontWeight: 'bold' }}
                />
                <LinearProgress
                  variant="determinate"
                  value={arm.status === 'idle' ? 0 : arm.status === 'suppressing' ? 100 : 50}
                  color={statusConfig.color as any}
                  sx={{
                    height: 8,
                    borderRadius: 1,
                    bgcolor: 'rgba(255,255,255,0.1)',
                  }}
                />
              </Box>

              {arm.targetQuadrant && (
                <Box sx={{ mt: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <LocationOn color="primary" />
                    <Typography variant="body2" color="text.secondary">
                      Target Room
                    </Typography>
                  </Box>
                  <Typography variant="body1" fontWeight="bold">
                    {mockRooms.find((r) => r.id === arm.targetQuadrant?.roomId)?.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2, mb: 1 }}>
                    <LocationOn color="primary" />
                    <Typography variant="body2" color="text.secondary">
                      Target Quadrant
                    </Typography>
                  </Box>
                  <Typography variant="body1" fontWeight="bold">
                    Quadrant {arm.targetQuadrant.quadrantNumber}
                  </Typography>
                </Box>
              )}

              <Box sx={{ mt: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Current Position
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  X: {arm.currentPosition.x}, Y: {arm.currentPosition.y}, Z:{' '}
                  {arm.currentPosition.z}
                </Typography>
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Last Action
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {new Date(arm.lastActionTime).toLocaleString()}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                {arm.lastAction}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card
        sx={{
          mt: 3,
          background: 'rgba(0, 212, 255, 0.05)',
          border: '1px solid rgba(0, 212, 255, 0.2)',
        }}
      >
        <CardContent>
          <Typography variant="body2">
            <strong>Note:</strong> The robotic arm automatically moves to the quadrant
            where fire is detected and activates fire suppression. The arm only moves to
            the specific fire quadrant, not the entire room.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default RoboticArmPage;
