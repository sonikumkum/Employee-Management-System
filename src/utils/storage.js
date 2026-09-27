// STEP 41: Centralized LocalStorage Utility

export const STORAGE_KEYS = {
  employees: "employee_management_system_employees",
  users: "employee_management_system_users",
  currentUser: "employee_management_system_current_user",
  attendance: "employee_management_system_attendance",
  leaves: "employee_management_system_leaves",
};

/* ==========================================
   GET DATA
========================================== */

export const getStorageData = (
  key,
  defaultValue = []
) => {
  try {
    const storedData = localStorage.getItem(key);

    if (!storedData) {
      return defaultValue;
    }

    const parsedData = JSON.parse(storedData);

    return parsedData;
  } catch (error) {
    console.error(
      `Error reading LocalStorage key "${key}":`,
      error
    );

    return defaultValue;
  }
};

/* ==========================================
   SAVE DATA
========================================== */

export const setStorageData = (
  key,
  data
) => {
  try {
    localStorage.setItem(
      key,
      JSON.stringify(data)
    );

    return true;
  } catch (error) {
    console.error(
      `Error saving LocalStorage key "${key}":`,
      error
    );

    return false;
  }
};

/* ==========================================
   REMOVE DATA
========================================== */

export const removeStorageData = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(
      `Error removing LocalStorage key "${key}":`,
      error
    );

    return false;
  }
};

/* ==========================================
   CLEAR APPLICATION DATA
========================================== */

export const clearApplicationData = () => {
  Object.values(STORAGE_KEYS).forEach(
    (key) => {
      localStorage.removeItem(key);
    }
  );
};

/* ==========================================
   CHECK STORAGE KEY
========================================== */

export const hasStorageData = (key) => {
  return localStorage.getItem(key) !== null;
};

export default {
  STORAGE_KEYS,
  getStorageData,
  setStorageData,
  removeStorageData,
  clearApplicationData,
  hasStorageData,
};