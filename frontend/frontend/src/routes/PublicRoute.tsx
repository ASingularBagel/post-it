import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '../redux/store'; 

interface PublicRouteProps {
    children : React.ReactElement;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
    const authenticated = useSelector((state: RootState) => state.user.isAuthenticated);

    if (authenticated) {
        return <Navigate to="/" replace />;
    }
    
    return children;
};

export default PublicRoute;