import React, { useState, useEffect } from 'react';
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
} from '@mui/material';
import {
  Thermostat,
  Cloud,
  CheckCircle,
  Warning,
  Error,
} from '@mui/icons-material';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from 'recharts';
import { mockSensors } from '../mockData/mockSensors';
import { mockRooms } from '../mockData/mockRooms';
import type { Sensor } from '../types';

interface ChartDataPoint {
  time: string;
  temperature: number;
  smoke: number;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  healthy: number;
  total: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, healthy, total }) => (
  <Card
    sx={{
      background: `linear-gradient(135deg, rgba(${color}, 0.15) 0%, rgba(${color}, 0.05) 100%)`,
      border: `1px solid rgba(${color}, 0.2)`,
      height: '100%',
    }}
  >
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4" fontWeight="bold" sx={{ mt: 1 }}>
            {value}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            {healthy}/{total} healthy
          </Typography>
        </Box>
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            bgcolor: `rgba(${color}, 0.2)`,
          }}
        >
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

interface TooltipEntry {
  name: string;
  value: number;
  color: string;
  dataKey: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: readonly TooltipEntry[];
  label?: string | number;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          bgcolor: 'rgba(21, 27, 61, 0.95)',
          border: '1px solid rgba(0, 212, 255, 0.3)',
          borderRadius: 2,
          p: 1.5,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        }}
      >
        <Typography variant="body2" fontWeight="bold" sx={{ mb: 1 }}>
          {label}
        </Typography>
        {payload.map((entry, index: number) => (
          <Typography
            key={index}
            variant="body2"
            sx={{ color: entry.color }}
          >
            {entry.name}: {entry.value.toFixed(1)}
            {entry.dataKey === 'temperature' ? '°C' : entry.dataKey === 'smoke' ? '%' : ''}
          </Typography>
        ))}
      </Box>
    );
  }
  return null;
};

const SensorsPage: React.FC = () => {
  const [sensors, setSensors] = useState<Sensor[]>(mockSensors);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSensors((prev) =>
        prev.map((sensor) => {
          let newValue = sensor.value;
          let newStatus = sensor.status;

          if (sensor.type === 'temperature') {
            newValue = Math.max(15, Math.min(30, sensor.value + (Math.random() - 0.5) * 2));
            newStatus =
              newValue > 28 ? 'alert' : newValue > 25 ? 'warning' : 'normal';
          } else if (sensor.type === 'smoke') {
            if (Math.random() < 0.01) {
              newValue = Math.random() * 100;
              newStatus = newValue > 50 ? 'alert' : 'warning';
            } else {
              newValue = 0;
              newStatus = 'normal';
            }
          }

          return {
            ...sensor,
            value: Math.round(newValue * 10) / 10,
            status: newStatus,
            timestamp: new Date().toISOString(),
          };
        })
      );

      // Update chart data
      const now = new Date();
      const newChartData = Array.from({ length: 15 }, (_, i) => {
        const time = new Date(now.getTime() - (14 - i) * 60000);
        const tempSensors = sensors.filter((s) => s.type === 'temperature');
        const avgTemp = tempSensors.reduce((sum, s) => sum + s.value, 0) / tempSensors.length;
        return {
          time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          temperature: avgTemp + (Math.random() - 0.5) * 2,
          smoke: Math.random() * 30,
        };
      });
      setChartData(newChartData);
    }, 3000);

    return () => clearInterval(interval);
  }, [sensors]);

  const getSensorIcon = (type: 'temperature' | 'smoke') => {
    switch (type) {
      case 'temperature':
        return <Thermostat sx={{ fontSize: 32 }} />;
      case 'smoke':
        return <Cloud sx={{ fontSize: 32 }} />;
      default:
        return null;
    }
  };

  const getStatusIcon = (status: 'normal' | 'warning' | 'alert') => {
    switch (status) {
      case 'alert':
        return <Error sx={{ color: 'error.main' }} />;
      case 'warning':
        return <Warning sx={{ color: 'warning.main' }} />;
      default:
        return <CheckCircle sx={{ color: 'success.main' }} />;
    }
  };

  const getStatusColor = (status: 'normal' | 'warning' | 'alert') => {
    switch (status) {
      case 'alert':
        return 'error';
      case 'warning':
        return 'warning';
      default:
        return 'success';
    }
  };

  const getRoomName = (roomId: string) => {
    return mockRooms.find((r) => r.id === roomId)?.name || roomId;
  };

  const temperatureSensors = sensors.filter((s) => s.type === 'temperature');
  const smokeSensors = sensors.filter((s) => s.type === 'smoke');
  const healthySensors = sensors.filter((s) => s.status === 'normal').length;
  const totalSensors = sensors.length;
  const healthPercentage = (healthySensors / totalSensors) * 100;

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Sensor Monitoring
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Real-time sensor data and health monitoring
        </Typography>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* @ts-expect-error - MUI Grid item prop is valid but TypeScript types are incorrect */}
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Temperature"
            value={temperatureSensors.length}
            icon={<Thermostat sx={{ fontSize: 32, color: 'primary.main' }} />}
            color="0, 212, 255"
            healthy={temperatureSensors.filter((s) => s.status === 'normal').length}
            total={temperatureSensors.length}
          />
        </Grid>
        {/* @ts-expect-error - MUI Grid item prop is valid but TypeScript types are incorrect */}
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Smoke"
            value={smokeSensors.length}
            icon={<Cloud sx={{ fontSize: 32, color: 'info.main' }} />}
            color="55, 66, 250"
            healthy={smokeSensors.filter((s) => s.status === 'normal').length}
            total={smokeSensors.length}
          />
        </Grid>
        {/* @ts-expect-error - MUI Grid item prop is valid but TypeScript types are incorrect */}
        <Grid item xs={12} sm={12} md={4}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, rgba(46, 213, 115, 0.15) 0%, rgba(46, 213, 115, 0.05) 100%)',
              border: '1px solid rgba(46, 213, 115, 0.2)',
              height: '100%',
            }}
          >
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Overall Health
              </Typography>
              <Typography variant="h4" fontWeight="bold" sx={{ mt: 1 }}>
                {healthPercentage.toFixed(0)}%
              </Typography>
              <LinearProgress
                variant="determinate"
                value={healthPercentage}
                sx={{
                  mt: 2,
                  height: 8,
                  borderRadius: 1,
                  bgcolor: 'rgba(255,255,255,0.1)',
                }}
                color={healthPercentage > 80 ? 'success' : healthPercentage > 50 ? 'warning' : 'error'}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* @ts-expect-error - MUI Grid item prop is valid but TypeScript types are incorrect */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Real-time Sensor Readings
              </Typography>
              <ResponsiveContainer width="100%" height={450}>
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="sensorColorTemp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="sensorColorSmoke" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ffa502" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#ffa502" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis
                    dataKey="time"
                    stroke="rgba(255,255,255,0.5)"
                    tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
                  />
                  <YAxis
                    stroke="rgba(255,255,255,0.5)"
                    tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
                  />
                  <Tooltip content={CustomTooltip} />
                  <Legend
                    wrapperStyle={{ color: 'rgba(255,255,255,0.7)' }}
                    iconType="circle"
                  />
                  <ReferenceLine y={25} stroke="#ffa502" strokeDasharray="3 3" label="Warning" />
                  <ReferenceLine y={28} stroke="#ff4757" strokeDasharray="3 3" label="Critical" />
                  <Area
                    type="monotone"
                    dataKey="temperature"
                    stroke="#00d4ff"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#sensorColorTemp)"
                    name="Temperature (°C)"
                    dot={{ fill: '#00d4ff', r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="smoke"
                    stroke="#ffa502"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#sensorColorSmoke)"
                    name="Smoke (%)"
                    dot={{ fill: '#ffa502', r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Sensors Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
            All Sensors
          </Typography>
          <TableContainer sx={{ overflowX: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'rgba(0, 212, 255, 0.1)' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Sensor ID</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Room</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Value</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Last Update</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sensors.map((sensor) => (
                  <TableRow
                    key={sensor.id}
                    sx={{
                      '&:hover': { bgcolor: 'rgba(0, 212, 255, 0.05)' },
                      bgcolor:
                        sensor.status === 'alert'
                          ? 'rgba(255, 71, 87, 0.05)'
                          : sensor.status === 'warning'
                          ? 'rgba(255, 165, 2, 0.05)'
                          : 'transparent',
                    }}
                  >
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {sensor.id}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getSensorIcon(sensor.type)}
                        <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                          {sensor.type}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{getRoomName(sensor.roomId)}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" fontWeight="bold">
                        {sensor.value}
                        {sensor.type === 'temperature' && '°C'}
                        {sensor.type === 'smoke' && '%'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getStatusIcon(sensor.status)}
                        <Chip
                          label={sensor.status.toUpperCase()}
                          color={getStatusColor(sensor.status)}
                          size="small"
                          sx={{ fontWeight: 'bold' }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(sensor.timestamp).toLocaleTimeString()}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SensorsPage;
