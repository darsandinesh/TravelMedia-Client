import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface privateRouteUser {
    children: ReactNode
}

const PrivateRouteUser: React.FC<privateRouteUser> = ({ children }) => {
    const user = localStorage.getItem('userToken');
    const refresh = localStorage.getItem('refreshToken');

    return user || refresh ? <Navigate to='/home' /> : <>{children}</>
}

export default PrivateRouteUser