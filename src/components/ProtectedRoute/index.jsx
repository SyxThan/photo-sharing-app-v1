import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ element, loggedInUser }) {
  if (!loggedInUser) {
    return <Navigate to="/" replace />;
  }
  return element;
}

export default ProtectedRoute;
