import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import StudentPage from './pages/StudentPage';
import TeacherPage from './pages/TeacherPage';
import LoginForm from './components/LoginForm';
import SignUpForm from './components/SignUpForm';
import StudentDashboard from './components/student/StudentDashboard';

function App() {
    const [user, setUser] = useState(null);

    const handleLogin = (userData) => {
        // Simulate login, set user role
        setUser({ ...userData, name: userData.email.split('@')[0], id: 'demo' });
    };

    return (
        <Router>
            <Routes>
                {/* Updated this line to always show LandingPage */}
                <Route path="/" element={<LandingPage onLogin={handleLogin} />} />

                <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
                <Route path="/signup" element={<SignUpForm onSignUp={handleLogin} />} />
                <Route path="/student" element={<StudentPage user={user} />} />
                <Route path="/teacher" element={<TeacherPage user={user} />} />
            </Routes>
        </Router>
    );
}

export default App;

