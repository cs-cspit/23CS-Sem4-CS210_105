/**
 * Set a value in localStorage with expiration (TTL)
 * @param {string} keyName - The key to store the value under
 * @param {any} keyValue - The value to store
 * @param {number} ttl - Time to live in seconds
 */
export const setWithExpiry = (keyName, keyValue, ttl) => {
  const data = {
    value: keyValue,
    ttl: Date.now() + (ttl * 1000),
  };
  localStorage.setItem(keyName, JSON.stringify(data));
};

/**
 * Get a value from localStorage, checking if it's expired
 * @param {string} keyName - The key to retrieve
 * @returns {any|null} The stored value or null if expired or not found
 */
export const getWithExpiry = (keyName) => {
  const data = localStorage.getItem(keyName);
  if (!data) {
    return null;
  }
  
  try {
    const item = JSON.parse(data);
    if (Date.now() > item.ttl) {
      localStorage.removeItem(keyName);
      return null;
    }
    return item.value;
  } catch (e) {
    console.error(`Error retrieving ${keyName} from storage:`, e);
    return null;
  }
};

/**
 * Clear user authentication data from localStorage
 */
export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('role');
};

/**
 * Store user authentication data
 * @param {object} authData - The authentication data
 * @param {string} authData.token - The authentication token
 * @param {object} authData.user - The user data
 * @param {number} ttl - Time to live in seconds
 */
export const saveAuthData = (authData, ttl = 100000) => {
  if (authData && authData.token && authData.user) {
    setWithExpiry('token', authData.token, ttl);
    setWithExpiry('role', authData.user.role, ttl);
    setWithExpiry('user', authData.user.username, ttl);
    return true;
  }
  return false;
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if authenticated
 */
export const isAuthenticated = () => {
  return getWithExpiry('token') !== null;
};

/**
 * Get user role
 * @returns {string|null} User role or null
 */
export const getUserRole = () => {
  return getWithExpiry('role');
};

/**
 * Get username
 * @returns {string|null} Username or null
 */
export const getUsername = () => {
  return getWithExpiry('user');
};

/**
 * Get authentication token
 * @returns {string|null} Authentication token or null
 */
export const getAuthToken = () => {
  return getWithExpiry('token');
}; 