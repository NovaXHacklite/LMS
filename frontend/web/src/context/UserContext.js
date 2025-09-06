import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const UserContext = createContext();

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const initializeUser = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const storedUser = localStorage.getItem('user');

                if (token && storedUser) {
                    const userData = JSON.parse(storedUser);
                    setUser(userData);

                    // Optionally refresh user data from backend
                    try {
                        const response = await authAPI.getProfile();
                        if (response.success) {
                            setUser(response.data.user);
                            localStorage.setItem('user', JSON.stringify(response.data.user));
                        }
                    } catch (err) {
                        console.log('Could not refresh user data:', err);
                    }
                }
            } catch (err) {
                setError('Failed to initialize user');
                console.error('User initialization error:', err);
            } finally {
                setLoading(false);
            }
        };

        initializeUser();
    }, []);

    const updateUser = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
    };

    const value = {
        user,
        setUser: updateUser,
        loading,
        error,
        logout,
        isAuthenticated: !!user
    };

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserContext;
