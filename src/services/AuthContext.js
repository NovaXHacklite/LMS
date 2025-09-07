// AuthContext.js - Authentication context for managing user state
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { authAPI, utils } from './api';

// Initial auth state
const initialState = {
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null
};

// Auth action types
const AUTH_ACTIONS = {
    LOGIN_START: 'LOGIN_START',
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',
    LOGIN_FAILURE: 'LOGIN_FAILURE',
    LOGOUT: 'LOGOUT',
    REGISTER_START: 'REGISTER_START',
    REGISTER_SUCCESS: 'REGISTER_SUCCESS',
    REGISTER_FAILURE: 'REGISTER_FAILURE',
    SET_LOADING: 'SET_LOADING',
    CLEAR_ERROR: 'CLEAR_ERROR',
    UPDATE_USER: 'UPDATE_USER'
};

// Auth reducer
const authReducer = (state, action) => {
    switch (action.type) {
        case AUTH_ACTIONS.LOGIN_START:
        case AUTH_ACTIONS.REGISTER_START:
            return {
                ...state,
                isLoading: true,
                error: null
            };

        case AUTH_ACTIONS.LOGIN_SUCCESS:
        case AUTH_ACTIONS.REGISTER_SUCCESS:
            return {
                ...state,
                user: action.payload.user,
                isAuthenticated: true,
                isLoading: false,
                error: null
            };

        case AUTH_ACTIONS.LOGIN_FAILURE:
        case AUTH_ACTIONS.REGISTER_FAILURE:
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: action.payload
            };

        case AUTH_ACTIONS.LOGOUT:
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: null
            };

        case AUTH_ACTIONS.SET_LOADING:
            return {
                ...state,
                isLoading: action.payload
            };

        case AUTH_ACTIONS.CLEAR_ERROR:
            return {
                ...state,
                error: null
            };

        case AUTH_ACTIONS.UPDATE_USER:
            return {
                ...state,
                user: { ...state.user, ...action.payload }
            };

        default:
            return state;
    }
};

// Create Auth Context
const AuthContext = createContext();

// Auth Provider Component
export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Check for existing auth data on app load
    useEffect(() => {
        const initializeAuth = () => {
            try {
                if (utils.isAuthenticated()) {
                    const user = utils.getCurrentUser();
                    if (user) {
                        dispatch({
                            type: AUTH_ACTIONS.LOGIN_SUCCESS,
                            payload: { user }
                        });
                    } else {
                        // Clear invalid auth data
                        utils.clearAuthData();
                        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
                    }
                } else {
                    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
                }
            } catch (error) {
                console.error('Auth initialization error:', error);
                utils.clearAuthData();
                dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
            }
        };

        initializeAuth();
    }, []);

    // Login function
    const login = async (credentials) => {
        try {
            dispatch({ type: AUTH_ACTIONS.LOGIN_START });

            console.log('Frontend login attempt:', credentials);

            const response = await authAPI.login({
                email: credentials.email,
                password: credentials.password,
                role: credentials.role
            });

            console.log('Login response in AuthContext:', response);

            dispatch({
                type: AUTH_ACTIONS.LOGIN_SUCCESS,
                payload: response
            });

            console.log('AuthContext state updated with LOGIN_SUCCESS');

            // Log authentication status after dispatch
            setTimeout(() => {
                console.log('Authentication check after login:', utils.isAuthenticated());
                console.log('Current user after login:', utils.getCurrentUser());
            }, 100);

            return response;
        } catch (error) {
            console.error('Login error:', error);
            dispatch({
                type: AUTH_ACTIONS.LOGIN_FAILURE,
                payload: error.message
            });
            throw error;
        }
    };

    // Register function
    const register = async (userData) => {
        try {
            dispatch({ type: AUTH_ACTIONS.REGISTER_START });

            const response = await authAPI.register({
                name: userData.name,
                email: userData.email,
                password: userData.password,
                role: userData.role,
                grade: userData.grade,
                subject: userData.subject
            });

            // Don't auto-login after registration
            // Just dispatch success to clear loading state
            dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });

            return response;
        } catch (error) {
            dispatch({
                type: AUTH_ACTIONS.REGISTER_FAILURE,
                payload: error.message
            });
            throw error;
        }
    };

    // Logout function
    const logout = async () => {
        try {
            await authAPI.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            dispatch({ type: AUTH_ACTIONS.LOGOUT });
        }
    };

    // Update user profile
    const updateProfile = async (profileData) => {
        try {
            const response = await authAPI.updateProfile(profileData);

            dispatch({
                type: AUTH_ACTIONS.UPDATE_USER,
                payload: response.user
            });

            // Update localStorage
            localStorage.setItem('user', JSON.stringify(response.user));

            return response;
        } catch (error) {
            throw error;
        }
    };

    // Clear error
    const clearError = () => {
        dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
    };

    // Auth context value
    const value = {
        // State
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isLoading: state.isLoading,
        error: state.error,

        // Actions
        login,
        register,
        logout,
        updateProfile,
        clearError,

        // Helper functions
        isStudent: () => state.user?.role === 'student',
        isTeacher: () => state.user?.role === 'teacher',
        isAdmin: () => state.user?.role === 'admin',
        getUserRole: () => state.user?.role || null,
        getUserId: () => state.user?._id || state.user?.id || null,
        getUserName: () => state.user?.name || 'User'
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// HOC for protected routes
export const withAuth = (Component) => {
    return (props) => {
        const { isAuthenticated, isLoading } = useAuth();

        if (isLoading) {
            return (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
                </div>
            );
        }

        if (!isAuthenticated) {
            return <Navigate to="/login" replace />;
        }

        return <Component {...props} />;
    };
};

// Component for role-based access
export const RoleGuard = ({ children, allowedRoles = [], fallback = null }) => {
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated || !allowedRoles.includes(user?.role)) {
        return fallback || <div>Access denied</div>;
    }

    return children;
};

export default AuthContext;
