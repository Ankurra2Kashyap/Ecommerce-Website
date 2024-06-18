import React from 'react';
import { useSelector } from "react-redux";
import { Navigate, Outlet } from 'react-router-dom';
import Loader from '../layout/Loader/Loader';

const ProtectedRoute = ({ isAdmin }) => {
  const { isAuthenticated, user, loading } = useSelector((state) => state.user);

  if (loading) return <div><Loader/></div>;  // Or use a Loader component

  if (isAuthenticated===false) {
    return <Navigate to="/login" replace />;
  }

  if (isAdmin && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
