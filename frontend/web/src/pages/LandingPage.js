import React from 'react';
import LoginForm from '../components/LoginForm';

const LandingPage = ({ onLogin }) => (
    <div className="landing-page">
        <h1>Personalized Learning Platform</h1>
        <LoginForm onLogin={onLogin} />
    </div>
);

export default LandingPage;
