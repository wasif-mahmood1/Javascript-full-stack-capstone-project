// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppContext } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { isLoggedIn } = useAppContext();

    if (!isLoggedIn) {
        return <Navigate to="/app/login" />;
    }

    return children ? children : <Outlet />;
};

export default ProtectedRoute;
