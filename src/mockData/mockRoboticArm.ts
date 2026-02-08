import type { RoboticArm } from '../types';

export const mockRoboticArm: RoboticArm = {
  id: 'arm-1',
  currentPosition: {
    x: 0,
    y: 0,
    z: 0,
  },
  status: 'idle',
  lastAction: 'System initialized',
  lastActionTime: new Date().toISOString(),
};

