// Employee Management System - Authentication Helper

const AUTH_STORAGE_KEY =
  "employee_management_system_current_user";

const USERS_STORAGE_KEY =
  "employee_management_system_users";

// Get demo users
export const getUsers = (defaultUsers = []) => {
  try {
    const storedUsers =
      localStorage.getItem(
        USERS_STORAGE_KEY
      );

    if (storedUsers) {
      return JSON.parse(storedUsers);
    }

    localStorage.setItem(
      USERS_STORAGE_KEY,
      JSON.stringify(defaultUsers)
    );

    return defaultUsers;
  } catch (error) {
    console.error(
      "Error loading users:",
      error
    );

    return defaultUsers;
  }
};

// Save users
export const saveUsers = (users) => {
  try {
    localStorage.setItem(
      USERS_STORAGE_KEY,
      JSON.stringify(users)
    );

    return true;
  } catch (error) {
    console.error(
      "Error saving users:",
      error
    );

    return false;
  }
};

// Login user
export const loginUser = (
  email,
  password,
  defaultUsers = []
) => {
  const users = getUsers(defaultUsers);

  const user = users.find(
    (item) =>
      item.email.toLowerCase() ===
        email.trim().toLowerCase() &&
      item.password === password
  );

  if (!user) {
    return {
      success: false,
      message:
        "Invalid email or password.",
    };
  }

  localStorage.setItem(
    AUTH_STORAGE_KEY,
    JSON.stringify(user)
  );

  return {
    success: true,
    user,
  };
};

// Get logged-in user
export const getCurrentUser = () => {
  try {
    const storedUser =
      localStorage.getItem(
        AUTH_STORAGE_KEY
      );

    if (!storedUser) {
      return null;
    }

    return JSON.parse(storedUser);
  } catch (error) {
    console.error(
      "Error loading current user:",
      error
    );

    return null;
  }
};

// Check authentication
export const isAuthenticated = () => {
  return getCurrentUser() !== null;
};

// Logout
export const logoutUser = () => {
  localStorage.removeItem(
    AUTH_STORAGE_KEY
  );
};

// Check role
export const hasRole = (allowedRoles = []) => {
  const user = getCurrentUser();

  if (!user) {
    return false;
  }

  return allowedRoles.includes(
    user.role
  );
};

export default {
  getUsers,
  saveUsers,
  loginUser,
  getCurrentUser,
  isAuthenticated,
  logoutUser,
  hasRole,
};