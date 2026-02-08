import type { Sensor } from '../types';

export const mockSensors: Sensor[] = [
  {
    id: 'sensor-1',
    roomId: 'room-1',
    type: 'temperature',
    value: 22,
    status: 'normal',
    timestamp: new Date().toISOString(),
  },
  {
    id: 'sensor-2',
    roomId: 'room-1',
    type: 'smoke',
    value: 0,
    status: 'normal',
    timestamp: new Date().toISOString(),
  },
  {
    id: 'sensor-3',
    roomId: 'room-2',
    type: 'temperature',
    value: 24,
    status: 'normal',
    timestamp: new Date().toISOString(),
  },
  {
    id: 'sensor-4',
    roomId: 'room-2',
    type: 'smoke',
    value: 0,
    status: 'normal',
    timestamp: new Date().toISOString(),
  },
  {
    id: 'sensor-5',
    roomId: 'room-3',
    type: 'temperature',
    value: 18,
    status: 'normal',
    timestamp: new Date().toISOString(),
  },
  {
    id: 'sensor-6',
    roomId: 'room-3',
    type: 'smoke',
    value: 0,
    status: 'normal',
    timestamp: new Date().toISOString(),
  },
];
