// Employee Management System - Protected Route

import { Navigate, useLocation } from "react-router-dom";
import { getCurrentUser } from "../utils/auth";

function ProtectedRoute({ children }) {
  const location = useLocation();

  const currentUser = getCurrentUser();

  // If user is not logged in,
  // redirect to Login page
  if (!currentUser) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  // If user is logged in,
  // allow access to protected pages
  return children;
}

export default ProtectedRoute;