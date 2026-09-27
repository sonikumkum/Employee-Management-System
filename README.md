# Employee Management System

A modern and responsive Employee Management System built with React.js for managing employees, attendance, leaves, departments, and workforce analytics.

## 🚀 Live Demo

Coming soon — Vercel deployment

## 📌 Project Overview

Employee Management System is a frontend-based HR management application designed to simplify everyday employee management tasks.

The application provides role-based access for Admin, HR, and Employee users with a responsive dashboard and LocalStorage-based data persistence.

## ✨ Features

### 🔐 Authentication & Authorization

- User Login
- Role-based access control
- Admin, HR and Employee roles
- Protected routes
- Automatic redirection for unauthorized users
- Logout confirmation

### 👥 Employee Management

- View all employees
- Add new employee
- Edit employee information
- View employee details
- Delete employees
- Search employees
- Filter by department
- Filter by designation
- Filter by status
- Employee ID generation
- Form validation

### 🏢 Department Management

- Department overview
- Employee count by department
- Active and inactive employee count
- Workforce distribution
- Department search
- Workforce percentage visualization

### 📅 Attendance Management

- Daily attendance
- Monthly attendance summary
- Present / Absent / Late / On Leave status
- Attendance percentage
- Mark all employees present
- Employee-specific attendance
- Admin and HR attendance management

### 🏖️ Leave Management

- Apply for leave
- Leave history
- Pending leave requests
- Approve leave
- Reject leave
- Delete pending leave
- Leave type filtering
- Department filtering
- Overlapping leave validation
- Leave duration calculation

### 📊 Dashboard

- Total employees
- Active employees
- Present today
- Employees on leave
- Department overview
- Attendance overview
- Leave overview
- Recent employees
- Employee personal dashboard

### 📈 Analytics

- Department distribution
- Attendance analysis
- Leave status analysis
- Leave type analysis
- Workforce summary
- Interactive charts using Recharts

### 👤 Profile Management

- View profile
- Edit name
- Edit email
- Edit phone number
- View department
- View designation
- View joining date
- View salary
- Role information

### 📱 Responsive Design

- Desktop responsive layout
- Tablet support
- Mobile sidebar
- Mobile navigation
- Responsive cards
- Responsive tables
- Responsive forms

## 🛠️ Tech Stack

### Frontend

- React.js
- JavaScript
- React Router DOM
- Bootstrap
- React Icons
- Recharts
- Vite

### Data Management

- LocalStorage
- React Hooks
- Custom utility functions

### Development Tools

- Visual Studio Code
- Git
- GitHub
- Vercel

## 📂 Project Structure

```text
employee-management-system/
│
├── public/
│
├── src/
│   │
│   ├── components/
│   │   ├── EmptyState.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── RoleProtectedRoute.jsx
│   │   └── Toast.jsx
│   │
│   ├── data/
│   │   ├── employees.js
│   │   └── users.js
│   │
│   ├── layouts/
│   │   └── DashboardLayout.jsx
│   │
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Employees.jsx
│   │   ├── AddEmployee.jsx
│   │   ├── EditEmployee.jsx
│   │   ├── EmployeeDetails.jsx
│   │   ├── Departments.jsx
│   │   ├── Attendance.jsx
│   │   ├── Leaves.jsx
│   │   ├── Analytics.jsx
│   │   └── Profile.jsx
│   │
│   ├── utils/
│   │   ├── auth.js
│   │   ├── helpers.js
│   │   └── storage.js
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── package.json
├── README.md
└── vite.config.js