import React, { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function ProtectedRoute({ children, allowedRoles }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("Authorization");

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const userRole = decodedToken.role;
        const registrationType = decodedToken.registerationType;

        // Check if the user's role is allowed
        if (allowedRoles && !allowedRoles.includes(userRole)) {
          setIsAuthorized(false);
        } else {
          // Check if the route is related to mating or breeding
          const isMatingOrBreedingRoute = location.pathname.includes('mating') || 
                                         location.pathname.includes('breeding') ||
                                         location.pathname.includes('breading');

          // If user is fattening type and trying to access mating/breeding routes, deny access
          if (registrationType === 'fattening' && isMatingOrBreedingRoute) {
            setIsAuthorized(false);
          } else {
            setIsAuthorized(true);
          }
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        setIsAuthorized(false);
      }
    } else {
      setIsAuthorized(false);
    }

    setIsLoading(false);
  }, [allowedRoles, location.pathname]);

  if (isLoading) {
    return <div>Loading...</div>; // Add a loading spinner or skeleton
  }

  return isAuthorized ? children : <Navigate to="/notAuthorized" replace />;
}

export default ProtectedRoute;