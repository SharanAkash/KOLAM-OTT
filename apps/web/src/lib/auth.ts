// Authentication utilities for role-based access

export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  plan?: {
    type: 'basic' | 'premium' | 'gold';
    expiryDate: string;
  };
}

// Mock users for development
// TODO: Replace with actual database lookup
export const MOCK_USERS = [
  {
    id: 'admin_1',
    email: 'admin@jstamilcinemas.com',
    password: 'Admin@123', // In production, this should be hashed
    name: 'Admin User',
    role: 'admin' as UserRole,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
  },
  {
    id: 'admin_2',
    email: 'akashsharan5544@gmail.com',
    password: '5Sharan$55', // In production, this should be hashed
    name: 'Sharan J S',
    phone: '9994168334',
    role: 'admin' as UserRole,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
  },
  {
    id: 'user_1',
    email: 'user@example.com',
    password: 'User@123',
    name: 'Regular User',
    role: 'user' as UserRole,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
    plan: {
      type: 'premium' as const,
      expiryDate: '2024-12-31',
    },
  },
];

// Authenticate user
export async function authenticateUser(
  email: string,
  password: string
): Promise<{ success: boolean; user?: User; error?: string }> {
  // TODO: Replace with actual database lookup and password hash comparison
  const user = MOCK_USERS.find((u) => u.email === email);

  if (!user) {
    return { success: false, error: 'Invalid email or password' };
  }

  if (user.password !== password) {
    return { success: false, error: 'Invalid email or password' };
  }

  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  return { success: true, user: userWithoutPassword as User };
}

// Check if user is admin
export function isAdmin(user: User | null): boolean {
  return user?.role === 'admin';
}

// Get redirect path - all users go to home
export function getRedirectPath(user: User): string {
  return '/'; // Everyone goes to home, admins see admin link in navigation
}
