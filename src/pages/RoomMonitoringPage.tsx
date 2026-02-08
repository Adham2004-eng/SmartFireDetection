import React, { useState, useEffect } from 'react';
import {
  Typography,
  Grid,
  Box,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  LinearProgress,
} from '@mui/material';
import { LocalFireDepartment, Power, Thermostat, Warning } from '@mui/icons-material';
import { mockRooms, updateQuadrantStatus } from '../mockData/mockRooms';
import type { Room, Quadrant } from '../types';
import { useAlerts } from '../context/AlertContext';

const RoomMonitoringPage: React.FC = () => {
  const { alerts, addAlert } = useAlerts();
  const [rooms, setRooms] = useState<Room[]>(mockRooms);
  const [selectedRoomId, setSelectedRoomId] = useState<string>(mockRooms[0].id);

  const selectedRoom = rooms.find((r) => r.id === selectedRoomId) || rooms[0];

  // React to fire alerts - update room state when fire alerts are added
  useEffect(() => {
    const fireAlerts = alerts.filter(
      (alert) => alert.type === 'fire' && !alert.acknowledged && alert.quadrantNumber
    );

    setRooms((currentRooms) => {
      let updatedRooms = [...currentRooms];
      let hasChanges = false;

      // Process each fire alert
      fireAlerts.forEach((alert) => {
        const roomIndex = updatedRooms.findIndex((r) => r.id === alert.roomId);
        if (roomIndex !== -1) {
          const room = updatedRooms[roomIndex];
          const quadrant = room.quadrants.find((q) => q.number === alert.quadrantNumber);
          
          if (quadrant) {
            // Check if we need to update this room
            const needsUpdate = quadrant.status !== 'fire' || 
              room.quadrants.some((q) => q.number !== alert.quadrantNumber && q.powerStatus === 'ON');
            
            if (needsUpdate) {
              // Use updateQuadrantStatus to properly set fire status and cut power
              updatedRooms = updateQuadrantStatus(
                updatedRooms,
                alert.roomId,
                alert.quadrantNumber,
                'fire'
              );
              hasChanges = true;
            }
          }
        }
      });

      // Reset rooms that don't have active fire alerts
      updatedRooms = updatedRooms.map((room) => {
        const hasActiveFire = fireAlerts.some((alert) => alert.roomId === room.id);
        if (!hasActiveFire) {
          // Check if room needs to be reset
          const needsReset = room.quadrants.some(
            (q) => q.status === 'fire' || q.powerStatus === 'OFF'
          );
          if (needsReset) {
            hasChanges = true;
            return {
              ...room,
              quadrants: room.quadrants.map((q) => ({
                ...q,
                status: 'safe' as const,
                temperature: q.temperature > 30 ? 22 : q.temperature,
                powerStatus: 'ON' as const,
              })),
            };
          }
        }
        return room;
      });

      return hasChanges ? updatedRooms : currentRooms;
    });
  }, [alerts]);

  // Simulate random fire events (for demo)
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.05) {
        setRooms((currentRooms) => {
          const randomRoom = currentRooms[Math.floor(Math.random() * currentRooms.length)];
          const randomQuadrant = Math.floor(Math.random() * 4) + 1;
          const hasExistingFire = randomRoom.quadrants.some((q) => q.status === 'fire');
          const hasActiveFireAlert = alerts.some(
            (a) => a.type === 'fire' && !a.acknowledged && a.roomId === randomRoom.id
          );

          if (!hasExistingFire && !hasActiveFireAlert) {
            // Create fire alert - this will trigger the useEffect above to update rooms
            addAlert({
              id: `alert-${Date.now()}`,
              type: 'fire',
              title: 'Fire Detected',
              message: `Fire detected in ${randomRoom.name}, Quadrant ${randomQuadrant}`,
              roomId: randomRoom.id,
              roomName: randomRoom.name,
              quadrantNumber: randomQuadrant,
              timestamp: new Date().toISOString(),
              acknowledged: false,
              cameraSnapshot: 'https://via.placeholder.com/300x200?text=Fire+Snapshot',
            });
          }
          return currentRooms;
        });
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [alerts, addAlert]);

  const QuadrantCard: React.FC<{ quadrant: Quadrant; roomName: string }> = ({
    quadrant,
    roomName,
  }) => {
    const isFire = quadrant.status === 'fire';
    const isPowerOff = quadrant.powerStatus === 'OFF';
    const tempStatus = quadrant.temperature > 25 ? 'warning' : 'normal';

    return (
      <Card
        sx={{
          height: '100%',
          minHeight: 280,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
          background: isFire
            ? 'linear-gradient(135deg, rgba(255, 71, 87, 0.2) 0%, rgba(255, 71, 87, 0.1) 100%)'
            : isPowerOff
            ? 'linear-gradient(135deg, rgba(176, 184, 209, 0.1) 0%, rgba(176, 184, 209, 0.05) 100%)'
            : 'linear-gradient(135deg, rgba(46, 213, 115, 0.15) 0%, rgba(46, 213, 115, 0.05) 100%)',
          border: `2px solid ${
            isFire
              ? 'rgba(255, 71, 87, 0.5)'
              : isPowerOff
              ? 'rgba(176, 184, 209, 0.3)'
              : 'rgba(46, 213, 115, 0.3)'
          }`,
          transition: 'all 0.3s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: isFire ? 12 : 6,
          },
        }}
      >
        {isFire && (
          <Box
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              animation: 'pulse 1s infinite',
              '@keyframes pulse': {
                '0%, 100%': { opacity: 1, transform: 'scale(1)' },
                '50%': { opacity: 0.7, transform: 'scale(1.1)' },
              },
            }}
          >
            <LocalFireDepartment sx={{ fontSize: 40, color: 'error.main' }} />
          </Box>
        )}
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Quadrant {quadrant.number}
            </Typography>
            <Chip
              label={quadrant.status.toUpperCase()}
              color={isFire ? 'error' : 'success'}
              sx={{
                bgcolor: isFire ? 'rgba(255, 71, 87, 0.2)' : 'rgba(46, 213, 115, 0.2)',
                color: isFire ? 'error.main' : 'success.main',
                fontWeight: 'bold',
              }}
            />
          </Box>

          <Box sx={{ mt: 'auto' }}>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Thermostat sx={{ fontSize: 20, color: tempStatus === 'warning' ? 'warning.main' : 'primary.main' }} />
                  <Typography variant="body2" color="text.secondary">
                    Temperature
                  </Typography>
                </Box>
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  color={isFire ? 'error.main' : tempStatus === 'warning' ? 'warning.main' : 'text.primary'}
                >
                  {quadrant.temperature}°C
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={Math.min((quadrant.temperature / 30) * 100, 100)}
                sx={{
                  height: 6,
                  borderRadius: 1,
                  bgcolor: 'rgba(255,255,255,0.1)',
                }}
                color={isFire ? 'error' : tempStatus === 'warning' ? 'warning' : 'primary'}
              />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Power sx={{ fontSize: 20, color: isPowerOff ? 'text.secondary' : 'success.main' }} />
                <Typography variant="body2" color="text.secondary">
                  Power
                </Typography>
              </Box>
              <Chip
                label={quadrant.powerStatus}
                size="small"
                sx={{
                  bgcolor: isPowerOff ? 'rgba(176, 184, 209, 0.2)' : 'rgba(46, 213, 115, 0.2)',
                  color: isPowerOff ? 'text.secondary' : 'success.main',
                  fontWeight: 'bold',
                }}
              />
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  };

  const fireCount = selectedRoom.quadrants.filter((q) => q.status === 'fire').length;
  const avgTemperature =
    selectedRoom.quadrants.reduce((sum, q) => sum + q.temperature, 0) /
    selectedRoom.quadrants.length;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
            Room Monitoring
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Real-time quadrant status and temperature monitoring
          </Typography>
        </Box>
        <FormControl sx={{ minWidth: { xs: '100%', sm: 250 } }}>
          <InputLabel>Select Room</InputLabel>
          <Select
            value={selectedRoomId}
            label="Select Room"
            onChange={(e) => setSelectedRoomId(e.target.value)}
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.05)',
            }}
          >
            {rooms.map((room) => (
              <MenuItem key={room.id} value={room.id}>
                {room.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Room Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.15) 0%, rgba(0, 212, 255, 0.05) 100%)',
              border: '1px solid rgba(0, 212, 255, 0.2)',
            }}
          >
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                {selectedRoom.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Room Status
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              background: fireCount > 0
                ? 'linear-gradient(135deg, rgba(255, 71, 87, 0.15) 0%, rgba(255, 71, 87, 0.05) 100%)'
                : 'linear-gradient(135deg, rgba(46, 213, 115, 0.15) 0%, rgba(46, 213, 115, 0.05) 100%)',
              border: `1px solid ${fireCount > 0 ? 'rgba(255, 71, 87, 0.2)' : 'rgba(46, 213, 115, 0.2)'}`,
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                {fireCount > 0 ? (
                  <LocalFireDepartment sx={{ color: 'error.main' }} />
                ) : (
                  <Warning sx={{ color: 'success.main' }} />
                )}
                <Typography variant="h6" fontWeight="bold">
                  {fireCount > 0 ? `${fireCount} Fire Detected` : 'All Clear'}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Fire Status
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={12} md={4}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, rgba(255, 165, 2, 0.15) 0%, rgba(255, 165, 2, 0.05) 100%)',
              border: '1px solid rgba(255, 165, 2, 0.2)',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Thermostat sx={{ color: 'warning.main' }} />
                <Typography variant="h6" fontWeight="bold">
                  {avgTemperature.toFixed(1)}°C
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Average Temperature
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {selectedRoom.quadrants.map((quadrant) => (
          <Grid item xs={12} sm={6} key={quadrant.id}>
            <QuadrantCard quadrant={quadrant} roomName={selectedRoom.name} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default RoomMonitoringPage;
