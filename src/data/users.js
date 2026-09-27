// STEP 43: User Accounts

const users = [
  {
    id: "USR001",
    name: "Admin User",
    email: "admin@ems.com",
    password: "admin123",
    role: "Admin",
    employeeId: null,
  },

  {
    id: "USR002",
    name: "HR Manager",
    email: "hr@ems.com",
    password: "hr123",
    role: "HR",
    employeeId: "EMP002",
  },

  {
    id: "USR003",
    name: "Employee User",
    email: "employee@ems.com",
    password: "employee123",
    role: "Employee",
    employeeId: "EMP001",
  },

  {
    id: "USR004",
    name: "Kumkum Soni",
    email: "sonikumkum18@ems.com",
    password: "soni123",
    role: "Employee",
    employeeId: "EMP001",
  },
];

export default users;