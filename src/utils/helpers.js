// Employee Management System - LocalStorage Helper Functions

const EMPLOYEE_STORAGE_KEY = "employee_management_system_employees";

// Get all employees from LocalStorage
export const getEmployees = (defaultEmployees = []) => {
  try {
    const storedEmployees = localStorage.getItem(
      EMPLOYEE_STORAGE_KEY
    );

    if (storedEmployees) {
      return JSON.parse(storedEmployees);
    }

    localStorage.setItem(
      EMPLOYEE_STORAGE_KEY,
      JSON.stringify(defaultEmployees)
    );

    return defaultEmployees;
  } catch (error) {
    console.error(
      "Error reading employees from LocalStorage:",
      error
    );

    return defaultEmployees;
  }
};

// Save all employees
export const saveEmployees = (employees) => {
  try {
    localStorage.setItem(
      EMPLOYEE_STORAGE_KEY,
      JSON.stringify(employees)
    );

    return true;
  } catch (error) {
    console.error(
      "Error saving employees to LocalStorage:",
      error
    );

    return false;
  }
};

// Add a new employee
export const addEmployee = (employee) => {
  const employees = getEmployees();

  const updatedEmployees = [
    ...employees,
    employee,
  ];

  saveEmployees(updatedEmployees);

  return employee;
};

// Update an existing employee
export const updateEmployee = (employeeId, updatedEmployee) => {
  const employees = getEmployees();

  const updatedEmployees = employees.map(
    (employee) =>
      employee.id === employeeId
        ? {
            ...employee,
            ...updatedEmployee,
          }
        : employee
  );

  saveEmployees(updatedEmployees);

  return updatedEmployees;
};

// Delete an employee
export const deleteEmployee = (employeeId) => {
  const employees = getEmployees();

  const updatedEmployees = employees.filter(
    (employee) => employee.id !== employeeId
  );

  saveEmployees(updatedEmployees);

  return updatedEmployees;
};

// Find employee by ID
export const getEmployeeById = (employeeId) => {
  const employees = getEmployees();

  return employees.find(
    (employee) => employee.id === employeeId
  );
};

// Generate next employee ID
export const generateEmployeeId = () => {
  const employees = getEmployees();

  if (employees.length === 0) {
    return "EMP001";
  }

  const numbers = employees
    .map((employee) => {
      const number = parseInt(
        employee.id.replace("EMP", ""),
        10
      );

      return Number.isNaN(number) ? 0 : number;
    })
    .filter((number) => number > 0);

  const highestNumber =
    numbers.length > 0
      ? Math.max(...numbers)
      : 0;

  return `EMP${String(highestNumber + 1).padStart(3, "0")}`;
};

// Clear all employee data
export const clearEmployees = () => {
  localStorage.removeItem(
    EMPLOYEE_STORAGE_KEY
  );
};

export default {
  getEmployees,
  saveEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeById,
  generateEmployeeId,
  clearEmployees,
};