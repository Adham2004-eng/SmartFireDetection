import type { UserRole } from '../types';

export interface MockUser {
  id: string;
  password: string;
  name: string;
  role: UserRole;
  email: string;
}

export const mockUsers: MockUser[] = [
  {
    id: 'ADMIN001',
    password: 'admin123',
    name: 'John Admin',
    role: 'admin',
    email: 'admin@sff.com',
  },
  {
    id: 'ADMIN002',
    password: 'admin456',
    name: 'Sarah Manager',
    role: 'admin',
    email: 'sarah@sff.com',
  },
  {
    id: 'SEC001',
    password: 'security123',
    name: 'Mike Security',
    role: 'security',
    email: 'mike@sff.com',
  },
  {
    id: 'SEC002',
    password: 'security456',
    name: 'Lisa Officer',
    role: 'security',
    email: 'lisa@sff.com',
  },
  {
    id: 'EMP001',
    password: 'emp123',
    name: 'David Employee',
    role: 'employee',
    email: 'david@sff.com',
  },
  {
    id: 'EMP002',
    password: 'emp456',
    name: 'Emma Worker',
    role: 'employee',
    email: 'emma@sff.com',
  },
  {
    id: 'EMP003',
    password: 'emp789',
    name: 'Tom Staff',
    role: 'employee',
    email: 'tom@sff.com',
  },
];

export const authenticateUser = (id: string, password: string): MockUser | null => {
  const user = mockUsers.find((u) => u.id === id && u.password === password);
  return user || null;
};


