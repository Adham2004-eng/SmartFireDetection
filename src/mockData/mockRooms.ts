import type { Room, Quadrant } from '../types';

export const mockRooms: Room[] = [
  {
    id: 'room-1',
    name: 'Main Office',
    quadrants: [
      {
        id: 'q1-1',
        number: 1,
        status: 'safe',
        temperature: 22,
        powerStatus: 'ON',
        coordinates: { x: 0, y: 0, z: 0 },
      },
      {
        id: 'q1-2',
        number: 2,
        status: 'safe',
        temperature: 23,
        powerStatus: 'ON',
        coordinates: { x: 5, y: 0, z: 0 },
      },
      {
        id: 'q1-3',
        number: 3,
        status: 'safe',
        temperature: 21,
        powerStatus: 'ON',
        coordinates: { x: 0, y: 5, z: 0 },
      },
      {
        id: 'q1-4',
        number: 4,
        status: 'safe',
        temperature: 22,
        powerStatus: 'ON',
        coordinates: { x: 5, y: 5, z: 0 },
      },
    ],
  },
  {
    id: 'room-2',
    name: 'Conference Room',
    quadrants: [
      {
        id: 'q2-1',
        number: 1,
        status: 'safe',
        temperature: 24,
        powerStatus: 'ON',
        coordinates: { x: 0, y: 0, z: 0 },
      },
      {
        id: 'q2-2',
        number: 2,
        status: 'safe',
        temperature: 25,
        powerStatus: 'ON',
        coordinates: { x: 5, y: 0, z: 0 },
      },
      {
        id: 'q2-3',
        number: 3,
        status: 'safe',
        temperature: 23,
        powerStatus: 'ON',
        coordinates: { x: 0, y: 5, z: 0 },
      },
      {
        id: 'q2-4',
        number: 4,
        status: 'safe',
        temperature: 24,
        powerStatus: 'ON',
        coordinates: { x: 5, y: 5, z: 0 },
      },
    ],
  },
  {
    id: 'room-3',
    name: 'Server Room',
    quadrants: [
      {
        id: 'q3-1',
        number: 1,
        status: 'safe',
        temperature: 18,
        powerStatus: 'ON',
        coordinates: { x: 0, y: 0, z: 0 },
      },
      {
        id: 'q3-2',
        number: 2,
        status: 'safe',
        temperature: 19,
        powerStatus: 'ON',
        coordinates: { x: 5, y: 0, z: 0 },
      },
      {
        id: 'q3-3',
        number: 3,
        status: 'safe',
        temperature: 18,
        powerStatus: 'ON',
        coordinates: { x: 0, y: 5, z: 0 },
      },
      {
        id: 'q3-4',
        number: 4,
        status: 'safe',
        temperature: 19,
        powerStatus: 'ON',
        coordinates: { x: 5, y: 5, z: 0 },
      },
    ],
  },
];

export const updateQuadrantStatus = (
  rooms: Room[],
  roomId: string,
  quadrantNumber: number,
  status: 'safe' | 'fire'
): Room[] => {
  return rooms.map((room) => {
    if (room.id === roomId) {
      const updatedQuadrants = room.quadrants.map((quad) => {
        if (quad.number === quadrantNumber) {
          return { ...quad, status, temperature: status === 'fire' ? 85 : quad.temperature };
        } else {
          // Turn off power for other quadrants when fire is detected
          return status === 'fire' ? { ...quad, powerStatus: 'OFF' as const } : quad;
        }
      });
      return { ...room, quadrants: updatedQuadrants };
    }
    return room;
  });
};

