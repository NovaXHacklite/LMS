import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './services/AuthContext';
import LandingPage from './pages/LandingPage';
import StudentPage from './pages/StudentPage';
import TeacherPage from './pages/TeacherPage';
import LoginForm from './components/LoginForm';
import SignUpForm from './components/SignUpForm';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { isAuthenticated, isLoading, user } = useAuth();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
        const redirectPath = user?.role === 'teacher' ? '/teacher' : '/student';
        return <Navigate to={redirectPath} replace />;
    }

    return children;
};

// Public Route Component (redirect if authenticated)
const PublicRoute = ({ children }) => {
    const { isAuthenticated, isLoading, user } = useAuth();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading...</p>
                </div>
            </div>
        );
    }

    if (isAuthenticated) {
        const redirectPath = user?.role === 'teacher' ? '/teacher' : '/student';
        return <Navigate to={redirectPath} replace />;
    }

    return children;
};

// Component to redirect to appropriate dashboard
const DashboardRedirect = () => {
    const { user } = useAuth();

    if (user?.role === 'teacher') {
        return <Navigate to="/teacher" replace />;
    } else {
        return <Navigate to="/student" replace />;
    }
};

function AppRoutes() {
    const { isAuthenticated } = useAuth();

    return (
        <Routes>
            {/* Public Routes */}
            <Route
                path="/"
                element={
                    isAuthenticated ? (
                        <Navigate to="/dashboard" replace />
                    ) : (
                        <LandingPage />
                    )
                }
            />
            <Route
                path="/login"
                element={
                    <PublicRoute>
                        <LoginForm />
                    </PublicRoute>
                }
            />
            <Route
                path="/signup"
                element={
                    <PublicRoute>
                        <SignUpForm />
                    </PublicRoute>
                }
            />

            {/* Student Route - accessible without authentication */}
            <Route
                path="/student"
                element={<StudentPage />}
            />

            {/* Protected Teacher Route */}
            <Route
                path="/teacher"
                element={
                    <ProtectedRoute allowedRoles={['teacher']}>
                        <TeacherPage />
                    </ProtectedRoute>
                }
            />

            {/* Dashboard redirect based on role */}
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <DashboardRedirect />
                    </ProtectedRoute>
                }
            />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="min-h-screen bg-gray-50">
                    <AppRoutes />
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
