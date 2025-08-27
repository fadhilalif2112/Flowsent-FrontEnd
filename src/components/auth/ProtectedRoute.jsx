import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    // versi simple: cek user di localStorage
    const user = localStorage.getItem("user");
    if (user) {
      setIsAuth(true);
    } else {
      setIsAuth(false);
    }
  }, []);

  if (isAuth === null) {
    return <div>Loading...</div>; // atau bisa spinner
  }

  return isAuth ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
