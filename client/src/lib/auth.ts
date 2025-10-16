// Auth utility for getting authenticated user
export function getAuthenticatedUserId(): number {
  const userStr = sessionStorage.getItem('user');
  if (!userStr) {
    throw new Error('User not authenticated. Please login to continue.');
  }
  
  try {
    const user = JSON.parse(userStr);
    if (!user.id) {
      throw new Error('Invalid user session. Please login again.');
    }
    return user.id;
  } catch (error) {
    throw new Error('Invalid user session. Please login again.');
  }
}

export function getAuthenticatedUser() {
  const userStr = sessionStorage.getItem('user');
  if (!userStr) {
    return null;
  }
  
  try {
    const user = JSON.parse(userStr);
    return user;
  } catch (error) {
    return null;
  }
}

export async function logout() {
  try {
    // Call logout endpoint to clear server session
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { default: logger } = require('./logger');
    logger.error('Logout error:', error);
  } finally {
    // Clear client-side session storage
    sessionStorage.removeItem('user');
    window.location.href = '/login';
  }
}
