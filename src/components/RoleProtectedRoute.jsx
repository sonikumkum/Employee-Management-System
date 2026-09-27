import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../utils/auth";

function RoleProtectedRoute({
  children,
  allowedRoles = [],
}) {
  const currentUser = getCurrentUser();

  // User is not logged in
  if (!currentUser) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // User does not have permission
  if (
    !allowedRoles.includes(
      currentUser.role
    )
  ) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  // User has permission
  return children;
}

export default RoleProtectedRoute;