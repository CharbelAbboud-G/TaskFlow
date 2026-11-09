import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { API_BASE_URL } from "../services/api";

function ProtectedRoute() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          localStorage.removeItem("token");
          setIsAuthenticated(false);
          return;
        }

        setIsAuthenticated(true);
      } catch {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
      }
    };

    verifyToken();
  }, []);

  if (isAuthenticated === null) {
    return <p>Checking authentication...</p>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;