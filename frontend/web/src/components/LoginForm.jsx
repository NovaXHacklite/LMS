import React, { useState } from 'react';

const LoginForm = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student');

    const handleSubmit = (e) => {
        e.preventDefault();
        onLogin({ email, password, role });
    };

    return (
        <form
            style={{
                maxWidth: '370px',
                margin: '60px auto',
                padding: '40px 32px 32px 32px',
                borderRadius: '18px',
                boxShadow: '0 8px 32px rgba(25, 118, 210, 0.15)',
                background: 'linear-gradient(135deg, #e3f2fd 0%, #fff 100%)',
                display: 'flex',
                flexDirection: 'column',
                gap: '22px',
                position: 'relative'
            }}
            onSubmit={handleSubmit}
        >
            <div style={{
                position: 'absolute',
                top: '-32px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: '#1976d2',
                borderRadius: '50%',
                width: '64px',
                height: '64px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 16px rgba(25, 118, 210, 0.18)'
            }}>
                <svg width="32" height="32" fill="#fff" viewBox="0 0 24 24">
                    <path d="M12 12c2.7 0 8 1.34 8 4v2H4v-2c0-2.66 5.3-4 8-4zm0-2a4 4 0 100-8 4 4 0 000 8z"/>
                </svg>
            </div>
            <h2 style={{
                textAlign: 'center',
                marginBottom: '0',
                color: '#1976d2',
                fontWeight: 700,
                letterSpacing: '1px'
            }}>Sign in</h2>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={{
                    padding: '12px',
                    borderRadius: '7px',
                    border: '1.5px solid #90caf9',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'border 0.2s',
                    background: '#f8fafc'
                }}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={{
                    padding: '12px',
                    borderRadius: '7px',
                    border: '1.5px solid #90caf9',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'border 0.2s',
                    background: '#f8fafc'
                }}
            />
            <select
                value={role}
                onChange={e => setRole(e.target.value)}
                style={{
                    padding: '12px',
                    borderRadius: '7px',
                    border: '1.5px solid #90caf9',
                    fontSize: '16px',
                    background: '#f8fafc'
                }}
            >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
            </select>
            <button
                type="submit"
                style={{
                    padding: '14px',
                    borderRadius: '7px',
                    border: 'none',
                    background: 'linear-gradient(90deg, #1976d2 60%, #42a5f5 100%)',
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: '17px',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(25, 118, 210, 0.10)',
                    letterSpacing: '1px',
                    transition: 'background 0.2s'
                }}
            >
                Login
            </button>
        </form>
    );
};

export default LoginForm;
