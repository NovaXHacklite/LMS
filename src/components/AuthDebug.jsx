// Debug helper component to check authentication flow
import React from 'react';
import { useAuth } from '../services/AuthContext';

const AuthDebug = () => {
    const { user, isAuthenticated, isLoading, error } = useAuth();

    if (process.env.NODE_ENV !== 'development') {
        return null;
    }

    return (
        <div style={{
            position: 'fixed',
            bottom: '10px',
            right: '10px',
            background: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '10px',
            borderRadius: '5px',
            fontSize: '12px',
            zIndex: 9999,
            maxWidth: '300px'
        }}>
            <h4 style={{ margin: '0 0 10px 0' }}>Auth Debug</h4>
            <div>Loading: {isLoading ? 'Yes' : 'No'}</div>
            <div>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</div>
            <div>User: {user ? JSON.stringify(user, null, 2) : 'None'}</div>
            <div>Error: {error || 'None'}</div>
            <div>Token: {localStorage.getItem('authToken') ? 'Present' : 'None'}</div>
        </div>
    );
};

export default AuthDebug;
