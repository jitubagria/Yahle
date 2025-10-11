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

export function logout() {
  sessionStorage.removeItem('user');
  window.location.href = '/login';
}
