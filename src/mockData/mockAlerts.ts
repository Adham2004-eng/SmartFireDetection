import type { Alert, AlertType, RiskLevel } from '../types';

export const mockAlerts: Alert[] = [
  {
    id: 'alert-1',
    type: 'high-risk-object',
    title: 'High-Risk Object Detected',
    message: 'Cigarette detected in Main Office',
    roomId: 'room-1',
    roomName: 'Main Office',
    riskLevel: 'high',
    detectedObject: 'Cigarette',
    timestamp: new Date(Date.now() - 300000).toISOString(),
    acknowledged: false,
  },
  {
    id: 'alert-2',
    type: 'high-risk-object',
    title: 'High-Risk Object Detected',
    message: 'Lighter detected in Conference Room',
    roomId: 'room-2',
    roomName: 'Conference Room',
    riskLevel: 'high',
    detectedObject: 'Lighter',
    timestamp: new Date(Date.now() - 600000).toISOString(),
    acknowledged: true,
  },
];

export const generateMockAlert = (): Alert => {
  const types: AlertType[] = ['fire', 'high-risk-object'];
  const riskObjects = ['Cigarette', 'Lighter', 'Microwave', 'Heater'];
  const rooms = [
    { id: 'room-1', name: 'Main Office' },
    { id: 'room-2', name: 'Conference Room' },
    { id: 'room-3', name: 'Server Room' },
  ];

  const type = types[Math.floor(Math.random() * types.length)];
  const room = rooms[Math.floor(Math.random() * rooms.length)];
  const quadrant = Math.floor(Math.random() * 4) + 1;

  if (type === 'fire') {
    return {
      id: `alert-${Date.now()}`,
      type: 'fire',
      title: 'Fire Detected',
      message: `Fire detected in ${room.name}, Quadrant ${quadrant}`,
      roomId: room.id,
      roomName: room.name,
      quadrantNumber: quadrant,
      timestamp: new Date().toISOString(),
      acknowledged: false,
      cameraSnapshot: 'https://via.placeholder.com/300x200?text=Fire+Snapshot',
    };
  } else {
    const object = riskObjects[Math.floor(Math.random() * riskObjects.length)];
    return {
      id: `alert-${Date.now()}`,
      type: 'high-risk-object',
      title: 'High-Risk Object Detected',
      message: `${object} detected in ${room.name}`,
      roomId: room.id,
      roomName: room.name,
      riskLevel: 'high' as RiskLevel,
      detectedObject: object,
      timestamp: new Date().toISOString(),
      acknowledged: false,
    };
  }
};
