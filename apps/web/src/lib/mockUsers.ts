// Mock users for testing
export const mockUsers = [
  {
    id: '1',
    email: 'admin@jstamilcinemas.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin',
    subscription: 'Premium',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
  },
  {
    id: '2',
    email: 'user@example.com',
    password: 'user123',
    name: 'Rajesh Kumar',
    role: 'user',
    subscription: 'Gold',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
  },
  {
    id: '3',
    email: 'premium@example.com',
    password: 'premium123',
    name: 'Priya Sharma',
    role: 'user',
    subscription: 'Premium',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
  },
  {
    id: '4',
    email: 'basic@example.com',
    password: 'basic123',
    name: 'Arjun Reddy',
    role: 'user',
    subscription: 'Basic',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
  },
  {
    id: '5',
    email: 'guest@example.com',
    password: 'guest123',
    name: 'Guest User',
    role: 'user',
    subscription: null, // No subscription - needs to subscribe
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
  },
];

// Helper function to login with mock user
export function loginMockUser(email: string, password: string) {
  const user = mockUsers.find(
    (u) => u.email === email && u.password === password
  );

  if (user) {
    // Store user without password
    const { password: _, ...userWithoutPassword } = user;
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    return { success: true, user: userWithoutPassword };
  }

  return { success: false, user: null };
}

// Quick login function for testing
export function quickLogin(userType: 'admin' | 'premium' | 'gold' | 'basic' | 'guest') {
  const userMap = {
    admin: mockUsers[0],
    premium: mockUsers[2],
    gold: mockUsers[1],
    basic: mockUsers[3],
    guest: mockUsers[4],
  };

  const user = userMap[userType];
  if (user) {
    const { password: _, ...userWithoutPassword } = user;
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    return userWithoutPassword;
  }
  return null;
}
