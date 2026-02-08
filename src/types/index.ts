export type UserRole = 'admin' | 'security' | 'employee';

export type SystemStatus = 'normal' | 'warning' | 'fire';

export type QuadrantStatus = 'safe' | 'fire';

export type RiskLevel = 'low' | 'medium' | 'high';

export type AlertType = 'fire' | 'high-risk-object';

export interface User {
  id: string;
  name: string;
  role: UserRole;
}

export interface Room {
  id: string;
  name: string;
  quadrants: Quadrant[];
}

export interface Quadrant {
  id: string;
  number: number;
  status: QuadrantStatus;
  temperature: number;
  powerStatus: 'ON' | 'OFF';
  coordinates: {
    x: number;
    y: number;
    z: number;
  };
}

export interface Sensor {
  id: string;
  roomId: string;
  type: 'temperature' | 'smoke';
  value: number;
  status: 'normal' | 'warning' | 'alert';
  timestamp: string;
}

export interface Alert {
  id: string;
  type: AlertType;
  title: string;
  message: string;
  roomId: string;
  roomName: string;
  quadrantNumber?: number;
  riskLevel?: RiskLevel;
  detectedObject?: string;
  timestamp: string;
  cameraSnapshot?: string;
  objectImage?: string;
  acknowledged: boolean;
}

export interface Event {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  roomId: string;
  roomName: string;
}

export interface RoboticArm {
  id: string;
  currentPosition: {
    x: number;
    y: number;
    z: number;
  };
  targetQuadrant?: {
    roomId: string;
    quadrantNumber: number;
  };
  status: 'idle' | 'moving' | 'suppressing';
  lastAction: string;
  lastActionTime: string;
}

