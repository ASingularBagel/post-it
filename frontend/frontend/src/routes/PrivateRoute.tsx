import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '../redux/store'; 

interface PrivateRouteProps {
    children : React.ReactElement;
}

// Redirects user when trying to access private data and not logged in
const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const authenticated = useSelector((state: RootState) => state.user.isAuthenticated);

    if (!authenticated) {
        return <Navigate to="/login" replace />;
    }
    
    return children;
};

export default PrivateRoute;