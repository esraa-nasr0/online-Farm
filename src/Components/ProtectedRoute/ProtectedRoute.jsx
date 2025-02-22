import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function ProtectedRoute({ children, allowedRoles }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("Authorization");

    if (token) {
      try {
        // Decode the token to get the user's role
        const decodedToken = jwtDecode(token);
        const userRole = decodedToken.role;

        // Check if the user's role is allowed
        if (allowedRoles && !allowedRoles.includes(userRole)) {
          setIsAuthorized(false);
        } else {
          setIsAuthorized(true);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        setIsAuthorized(false);
      }
    } else {
      setIsAuthorized(false);
    }

    setIsLoading(false);
  }, [allowedRoles]);

  if (isLoading) {
    return <div>Loading...</div>; // Add a loading spinner or skeleton
  }

  return isAuthorized ? children : <Navigate to="/notAuthorized" replace />;
}

export default ProtectedRoute;