import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Layout
import DashboardLayout from "./layouts/DashboardLayout";

// Authentication
import ProtectedRoute from "./components/ProtectedRoute";
import RoleProtectedRoute from "./components/RoleProtectedRoute";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import AddEmployee from "./pages/AddEmployee";
import EmployeeDetails from "./pages/EmployeeDetails";
import EditEmployee from "./pages/EditEmployee";
import Departments from "./pages/Departments";
import Attendance from "./pages/Attendance";
import Leaves from "./pages/Leaves";
import Analytics from "./pages/Analytics";
import Profile from "./pages/Profile";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* Login */}

        <Route
          path="/login"
          element={<Login />}
        />


        {/* Protected Application */}

        <Route
          path="/*"
          element={
            <ProtectedRoute>

              <DashboardLayout>

                <Routes>

                  {/* Dashboard */}

                  <Route
                    path="/dashboard"
                    element={
                      <RoleProtectedRoute
                        allowedRoles={[
                          "Admin",
                          "HR",
                          "Employee",
                        ]}
                      >
                        <Dashboard />
                      </RoleProtectedRoute>
                    }
                  />


                  {/* Employees */}

                  <Route
                    path="/employees"
                    element={
                      <RoleProtectedRoute
                        allowedRoles={[
                          "Admin",
                          "HR",
                        ]}
                      >
                        <Employees />
                      </RoleProtectedRoute>
                    }
                  />


                  {/* Add Employee */}

                  <Route
                    path="/employees/add"
                    element={
                      <RoleProtectedRoute
                        allowedRoles={[
                          "Admin",
                          "HR",
                        ]}
                      >
                        <AddEmployee />
                      </RoleProtectedRoute>
                    }
                  />


                  {/* Employee Details */}

                  <Route
                    path="/employees/:id"
                    element={
                      <RoleProtectedRoute
                        allowedRoles={[
                          "Admin",
                          "HR",
                        ]}
                      >
                        <EmployeeDetails />
                      </RoleProtectedRoute>
                    }
                  />


                  {/* Edit Employee */}

                  <Route
                    path="/employees/edit/:id"
                    element={
                      <RoleProtectedRoute
                        allowedRoles={[
                          "Admin",
                          "HR",
                        ]}
                      >
                        <EditEmployee />
                      </RoleProtectedRoute>
                    }
                  />


                  {/* Departments */}

                  <Route
                    path="/departments"
                    element={
                      <RoleProtectedRoute
                        allowedRoles={[
                          "Admin",
                          "HR",
                        ]}
                      >
                        <Departments />
                      </RoleProtectedRoute>
                    }
                  />


                  {/* Attendance */}

                  <Route
                    path="/attendance"
                    element={
                      <RoleProtectedRoute
                        allowedRoles={[
                          "Admin",
                          "HR",
                          "Employee",
                        ]}
                      >
                        <Attendance />
                      </RoleProtectedRoute>
                    }
                  />


                  {/* Leaves */}

                  <Route
                    path="/leaves"
                    element={
                      <RoleProtectedRoute
                        allowedRoles={[
                          "Admin",
                          "HR",
                          "Employee",
                        ]}
                      >
                        <Leaves />
                      </RoleProtectedRoute>
                    }
                  />


                  {/* Analytics */}

                  <Route
                    path="/analytics"
                    element={
                      <RoleProtectedRoute
                        allowedRoles={[
                          "Admin",
                          "HR",
                        ]}
                      >
                        <Analytics />
                      </RoleProtectedRoute>
                    }
                  />


                  {/* Profile */}

                  <Route
                    path="/profile"
                    element={
                      <RoleProtectedRoute
                        allowedRoles={[
                          "Admin",
                          "HR",
                          "Employee",
                        ]}
                      >
                        <Profile />
                      </RoleProtectedRoute>
                    }
                  />


                  {/* Unknown Route */}

                  <Route
                    path="*"
                    element={
                      <Navigate
                        to="/dashboard"
                        replace
                      />
                    }
                  />

                </Routes>

              </DashboardLayout>

            </ProtectedRoute>
          }
        />


        {/* Root */}

        <Route
          path="/"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;