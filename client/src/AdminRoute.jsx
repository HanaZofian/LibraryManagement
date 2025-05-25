import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
  // Example: get admin token from localStorage (adjust as needed)
  const adminToken = localStorage.getItem("adminToken");

  // If no admin token, redirect to AdminLogin
  if (!adminToken) {
    return <Navigate to="/AdminLogin" replace />;
  }

  // If authorized, render child routes
  return <Outlet />;
};

export default AdminRoute;
