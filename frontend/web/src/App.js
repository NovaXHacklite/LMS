import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import StudentPage from './pages/StudentPage';
import TeacherPage from './pages/TeacherPage';

function App() {
    const [user, setUser] = useState(null);

    const handleLogin = (userData) => {
        // Simulate login, set user role
        setUser({ ...userData, name: userData.email.split('@')[0], id: 'demo' });
    };

    return (
        <Router>
            <Routes>
                <Route path="/" element={user ? (
                    user.role === 'student' ? <Navigate to="/student" /> : <Navigate to="/teacher" />
                ) : <LandingPage onLogin={handleLogin} />} />
                <Route path="/student" element={user && user.role === 'student' ? <StudentPage user={user} /> : <Navigate to="/" />} />
                <Route path="/teacher" element={user && user.role === 'teacher' ? <TeacherPage user={user} /> : <Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

export default App;
