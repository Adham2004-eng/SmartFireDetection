import React, { useMemo, useState, useEffect } from 'react';
import {
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  IconButton,
  Dialog,
  DialogContent,
} from '@mui/material';
import {
  LocalFireDepartment,
  CheckCircle,
  Warning,
  Sensors,
  CameraAlt,
  Home,
  TrendingUp,
  Fullscreen,
  FullscreenExit,
} from '@mui/icons-material';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  ReferenceLine,
  Legend,
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useAlerts } from '../context/AlertContext';
import { mockRooms } from '../mockData/mockRooms';
import { mockSensors } from '../mockData/mockSensors';
import type { SystemStatus } from '../types';

interface SensorDataPoint {
  time: string;
  temperature: number;
  smoke: number;
}

interface TemperatureDataPoint {
  name: string;
  temp: number;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  trend?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, trend }) => (
  <Card
    sx={{
      background: `linear-gradient(135deg, rgba(${color}, 0.15) 0%, rgba(${color}, 0.05) 100%)`,
      border: `1px solid rgba(${color}, 0.2)`,
      height: '100%',
      transition: 'all 0.3s',
      '&:hover': {
        transform: 'translateY(-4px)',
        borderColor: `rgba(${color}, 0.4)`,
        boxShadow: `0 8px 24px rgba(${color}, 0.2)`,
      },
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
          {trend && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
              <TrendingUp sx={{ fontSize: 16, color: 'success.main' }} />
              <Typography variant="caption" color="success.main">
                {trend}
              </Typography>
            </Box>
          )}
        </Box>
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            bgcolor: `rgba(${color}, 0.2)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
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

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { alerts } = useAlerts();
  const [sensorData, setSensorData] = useState<SensorDataPoint[]>([]);
  const [temperatureData, setTemperatureData] = useState<TemperatureDataPoint[]>([]);
  const [sensorFullscreen, setSensorFullscreen] = useState(false);
  const [tempFullscreen, setTempFullscreen] = useState(false);

  const systemStatus: SystemStatus = useMemo(() => {
    const unacknowledgedAlerts = alerts.filter((alert) => !alert.acknowledged);
    const hasFire = unacknowledgedAlerts.some((alert) => alert.type === 'fire');
    const hasHighRisk = unacknowledgedAlerts.some(
      (alert) => alert.type === 'high-risk-object'
    );
    if (hasFire) return 'fire';
    if (hasHighRisk) return 'warning';
    return 'normal';
  }, [alerts]);

  // Generate real-time sensor data with better visualization
  useEffect(() => {
    const generateData = () => {
      const now = new Date();
      const newData = Array.from({ length: 20 }, (_, i) => {
        const time = new Date(now.getTime() - (19 - i) * 60000);
        const baseTemp = 22;
        const baseSmoke = 5;
        return {
          time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          temperature: Math.max(18, Math.min(30, baseTemp + Math.sin(i * 0.3) * 3 + (Math.random() - 0.5) * 2)),
          smoke: Math.max(0, Math.min(50, baseSmoke + Math.sin(i * 0.2) * 5 + (Math.random() - 0.5) * 3)),
        };
      });
      setSensorData(newData);

      const tempData = mockRooms.flatMap((room) =>
        room.quadrants.map((q) => ({
          name: `${room.name.substring(0, 6)} Q${q.number}`,
          temp: Math.max(18, Math.min(28, q.temperature + (Math.random() - 0.5) * 2)),
        }))
      );
      setTemperatureData(tempData);
    };

    generateData();
    const interval = setInterval(generateData, 5000);
    return () => clearInterval(interval);
  }, []);

  const activeAlertsCount = useMemo(() => {
    return alerts.filter((alert) => !alert.acknowledged).length;
  }, [alerts]);
  const cameraCount = mockRooms.length * 4;
  const activeSensors = mockSensors.filter((s) => s.status === 'normal').length;
  const totalSensors = mockSensors.length;
  const sensorHealth = (activeSensors / totalSensors) * 100;

  const getStatusConfig = (status: SystemStatus): {
    color: 'error' | 'warning' | 'success';
    icon: React.ReactNode;
    text: string;
    bg: string;
  } => {
    switch (status) {
      case 'fire':
        return {
          color: 'error',
          icon: <LocalFireDepartment sx={{ fontSize: 32 }} />,
          text: 'FIRE DETECTED',
          bg: 'linear-gradient(135deg, rgba(255, 71, 87, 0.2) 0%, rgba(255, 71, 87, 0.1) 100%)',
        };
      case 'warning':
        return {
          color: 'warning',
          icon: <Warning sx={{ fontSize: 32 }} />,
          text: 'WARNING',
          bg: 'linear-gradient(135deg, rgba(255, 165, 2, 0.2) 0%, rgba(255, 165, 2, 0.1) 100%)',
        };
      default:
        return {
          color: 'success',
          icon: <CheckCircle sx={{ fontSize: 32 }} />,
          text: 'NORMAL',
          bg: 'linear-gradient(135deg, rgba(46, 213, 115, 0.2) 0%, rgba(46, 213, 115, 0.1) 100%)',
        };
    }
  };

  const statusConfig = getStatusConfig(systemStatus);

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Dashboard Overview
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Welcome back, {user?.name} • Real-time system monitoring
        </Typography>
      </Box>

      {/* System Status */}
      <Card
        sx={{
          mb: 3,
          background: statusConfig.bg,
          border: `2px solid ${
            systemStatus === 'fire'
              ? 'rgba(255, 71, 87, 0.5)'
              : systemStatus === 'warning'
              ? 'rgba(255, 165, 2, 0.5)'
              : 'rgba(46, 213, 115, 0.5)'
          }`,
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: `rgba(${
                  systemStatus === 'fire' ? '255, 71, 87' : systemStatus === 'warning' ? '255, 165, 2' : '46, 213, 115'
                }, 0.2)`,
              }}
            >
              {statusConfig.icon}
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h3" fontWeight="bold">
                {statusConfig.text}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                System is {systemStatus === 'fire' ? 'in critical state' : systemStatus === 'warning' ? 'under warning' : 'operating normally'}
              </Typography>
            </Box>
            <Chip
              label={systemStatus.toUpperCase()}
              color={statusConfig.color}
              sx={{ fontSize: '0.875rem', fontWeight: 'bold', height: 32 }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* @ts-expect-error - MUI Grid item prop is valid but TypeScript types are incorrect */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Alerts"
            value={activeAlertsCount}
            icon={<Warning sx={{ fontSize: 28, color: 'warning.main' }} />}
            color="255, 165, 2"
          />
        </Grid>
        {/* @ts-expect-error - MUI Grid item prop is valid but TypeScript types are incorrect */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Cameras"
            value={cameraCount}
            icon={<CameraAlt sx={{ fontSize: 28, color: 'primary.main' }} />}
            color="0, 212, 255"
          />
        </Grid>
        {/* @ts-expect-error - MUI Grid item prop is valid but TypeScript types are incorrect */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Sensors"
            value={`${activeSensors}/${totalSensors}`}
            icon={<Sensors sx={{ fontSize: 28, color: 'success.main' }} />}
            color="46, 213, 115"
            trend={`${sensorHealth.toFixed(0)}% healthy`}
          />
        </Grid>
        {/* @ts-expect-error - MUI Grid item prop is valid but TypeScript types are incorrect */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Rooms"
            value={mockRooms.length}
            icon={<Home sx={{ fontSize: 28, color: 'info.main' }} />}
            color="55, 66, 250"
          />
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        {/* Main sensor chart full-width for better readability */}
        {/* @ts-expect-error - MUI Grid item prop is valid but TypeScript types are incorrect */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="h6" fontWeight="bold">
                  Real-time Sensor Data
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => setSensorFullscreen(true)}
                  sx={{ color: 'text.secondary' }}
                >
                  <Fullscreen fontSize="small" />
                </IconButton>
              </Box>
              <ResponsiveContainer width="100%" height={420}>
                <AreaChart data={sensorData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorSmoke" x1="0" y1="0" x2="0" y2="1">
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
                    fill="url(#colorTemp)"
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
                    fill="url(#colorSmoke)"
                    name="Smoke (%)"
                    dot={{ fill: '#ffa502', r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Secondary charts row */}
        {/* @ts-expect-error - MUI Grid item prop is valid but TypeScript types are incorrect */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Sensor Health
              </Typography>
              <Box sx={{ mt: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Overall Health
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {sensorHealth.toFixed(0)}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={sensorHealth}
                  sx={{
                    height: 12,
                    borderRadius: 1,
                    bgcolor: 'rgba(255,255,255,0.1)',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 1,
                    },
                  }}
                  color={sensorHealth > 80 ? 'success' : sensorHealth > 50 ? 'warning' : 'error'}
                />
              </Box>
              <Box sx={{ mt: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Active Sensors
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {activeSensors}/{totalSensors}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* @ts-expect-error - MUI Grid item prop is valid but TypeScript types are incorrect */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="h6" fontWeight="bold">
                  Room Temperatures
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => setTempFullscreen(true)}
                  sx={{ color: 'text.secondary' }}
                >
                  <Fullscreen fontSize="small" />
                </IconButton>
              </Box>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={temperatureData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis
                    dataKey="name"
                    stroke="rgba(255,255,255,0.5)"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 10 }}
                  />
                  <YAxis
                    stroke="rgba(255,255,255,0.5)"
                    tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
                  />
                  <Tooltip content={CustomTooltip} />
                  <ReferenceLine y={25} stroke="#ffa502" strokeDasharray="3 3" />
                  <Bar
                    dataKey="temp"
                    radius={[6, 6, 0, 0]}
                    name="Temperature (°C)"
                    fill="#00d4ff"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Fullscreen dialogs */}
      <Dialog
        open={sensorFullscreen}
        onClose={() => setSensorFullscreen(false)}
        fullWidth
        maxWidth="xl"
        PaperProps={{
          sx: {
            bgcolor: 'background.default',
          },
        }}
      >
        <DialogContent sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="h6" fontWeight="bold">
              Real-time Sensor Data (Fullscreen)
            </Typography>
            <IconButton onClick={() => setSensorFullscreen(false)} sx={{ color: 'text.secondary' }}>
              <FullscreenExit />
            </IconButton>
          </Box>
          <Box sx={{ width: '100%', height: '70vh' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sensorData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTempFull" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorSmokeFull" x1="0" y1="0" x2="0" y2="1">
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
                <Tooltip content={<CustomTooltip />} />
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
                  fill="url(#colorTempFull)"
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
                  fill="url(#colorSmokeFull)"
                  name="Smoke (%)"
                  dot={{ fill: '#ffa502', r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </DialogContent>
      </Dialog>

      <Dialog
        open={tempFullscreen}
        onClose={() => setTempFullscreen(false)}
        fullWidth
        maxWidth="xl"
        PaperProps={{
          sx: {
            bgcolor: 'background.default',
          },
        }}
      >
        <DialogContent sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="h6" fontWeight="bold">
              Room Temperatures (Fullscreen)
            </Typography>
            <IconButton onClick={() => setTempFullscreen(false)} sx={{ color: 'text.secondary' }}>
              <FullscreenExit />
            </IconButton>
          </Box>
          <Box sx={{ width: '100%', height: '70vh' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={temperatureData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis
                  dataKey="name"
                  stroke="rgba(255,255,255,0.5)"
                  angle={-30}
                  textAnchor="end"
                  height={80}
                  tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
                />
                <YAxis
                  stroke="rgba(255,255,255,0.5)"
                  tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={25} stroke="#ffa502" strokeDasharray="3 3" />
                <Bar
                  dataKey="temp"
                  radius={[6, 6, 0, 0]}
                  name="Temperature (°C)"
                  fill="#00d4ff"
                />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default DashboardPage;
