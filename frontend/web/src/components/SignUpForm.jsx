import React, { useState } from 'react';

const SignUpForm = ({ onSignUp }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState('student');
    const [showPassword, setShowPassword] = useState(false);

    const [touched, setTouched] = useState({});
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState('');
    const [loading, setLoading] = useState(false);

    const validate = () => {
        const e = {};
        if (!name.trim()) {
            e.name = 'Name is required';
        }
        if (!email.trim()) {
            e.email = 'Email is required';
        } else if (!/^\S+@\S+\.\S+$/.test(email)) {
            e.email = 'Please enter a valid email';
        }
        if (!password) {
            e.password = 'Password is required';
        } else if (password.length < 6) {
            e.password = 'Password must be at least 6 characters';
        }
        return e;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setTouched({ name: true, email: true, password: true });
        const v = validate();
        setErrors(v);
        if (Object.keys(v).length) return;

        setLoading(true);
        setSubmitError('');
        try {
            const result = onSignUp?.({ name, email, password, role });
            if (result && typeof result.then === 'function') {
                await result;
            }
        } catch (err) {
            setSubmitError(err?.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const onBlur = (field) => {
        setTouched((t) => ({ ...t, [field]: true }));
        const v = validate();
        setErrors(v);
    };

    // SVG Icons
    const MailIcon = () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
        </svg>
    );

    const LockIcon = () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <circle cx="12" cy="16" r="1"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
    );

    const EyeIcon = () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
        </svg>
    );

    const EyeOffIcon = () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
            <line x1="1" y1="1" x2="23" y2="23"/>
            <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"/>
        </svg>
    );

    const UserIcon = () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
        </svg>
    );

    const GraduationCapIcon = () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
            <path d="M6 12v5c3 3 9 3 12 0v-5"/>
        </svg>
    );

    // New image for sign up
    const imageUrl = "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=800&q=80";

    return (
        <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
            {/* Large screens: side-by-side layout */}
            <div 
                style={{ 
                    display: 'none',
                    '@media (min-width: 1024px)': { display: 'flex' }
                }}
                className="lg-layout"
            >
                <div
                    style={{
                        flex: 1,
                        backgroundImage: `linear-gradient(135deg, rgba(202, 240, 248, 0.8) 0%, rgba(144, 224, 239, 0.8) 50%, rgba(0, 180, 216, 0.8) 100%), url('${imageUrl}')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        minHeight: '100vh',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '40px',
                    }}
                >
                    <div style={{ textAlign: 'center', color: 'white', maxWidth: '500px' }}>
                        <div
                            style={{
                                width: '120px',
                                height: '120px',
                                borderRadius: '24px',
                                background: 'rgba(255, 255, 255, 0.2)',
                                backdropFilter: 'blur(20px)',
                                margin: '0 auto 32px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                            }}
                        >
                            <span style={{ fontSize: '48px' }}>🚀</span>
                        </div>
                        <h1 style={{ 
                            fontSize: '48px', 
                            fontWeight: '800', 
                            margin: '0 0 16px 0',
                            background: 'linear-gradient(135deg, #ffffff 0%, #CAF0F8 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                        }}>
                            Start Your Learning Journey
                        </h1>
                        <p style={{ fontSize: '20px', opacity: 0.9, lineHeight: 1.6 }}>
                            Create your account and unlock a world of interactive education.
                        </p>
                    </div>
                </div>

                <div
                    style={{
                        flex: 1,
                        background: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '40px',
                        minHeight: '100vh',
                    }}
                >
                    <SignUpFormContent 
                        {...{
                            name, setName, email, setEmail, password, setPassword, role, setRole,
                            showPassword, setShowPassword,
                            touched, errors, submitError, loading,
                            handleSubmit, onBlur,
                            MailIcon, LockIcon, EyeIcon, EyeOffIcon, UserIcon, GraduationCapIcon
                        }}
                    />
                </div>
            </div>

            {/* Medium and small screens: stacked layout */}
            <div 
                style={{ 
                    display: 'block',
                    '@media (min-width: 1024px)': { display: 'none' }
                }}
                className="sm-md-layout"
            >
                <div
                    style={{
                        minHeight: '40vh',
                        backgroundImage: `linear-gradient(135deg, rgba(202, 240, 248, 0.8) 0%, rgba(144, 224, 239, 0.8) 50%, rgba(0, 180, 216, 0.8) 100%), url('${imageUrl}')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '20px',
                        position: 'relative',
                    }}
                >
                    <div style={{ textAlign: 'center', color: 'white', zIndex: 1 }}>
                        <div
                            style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '20px',
                                background: 'rgba(255, 255, 255, 0.2)',
                                backdropFilter: 'blur(20px)',
                                margin: '0 auto 20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                            }}
                        >
                            <span style={{ fontSize: '32px' }}>🚀</span>
                        </div>
                        <h1 style={{ 
                            fontSize: '28px', 
                            fontWeight: '800', 
                            margin: '0 0 8px 0',
                            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}>
                            Create Account
                        </h1>
                        <p style={{ fontSize: '16px', opacity: 0.9 }}>
                            Sign up and start learning today!
                        </p>
                    </div>
                </div>

                <div style={{ background: '#ffffff', padding: '40px 20px', minHeight: '60vh' }}>
                    <div style={{ maxWidth: '400px', margin: '0 auto' }}>
                        <SignUpFormContent 
                            {...{
                                name, setName, email, setEmail, password, setPassword, role, setRole,
                                showPassword, setShowPassword,
                                touched, errors, submitError, loading,
                                handleSubmit, onBlur,
                                MailIcon, LockIcon, EyeIcon, EyeOffIcon, UserIcon, GraduationCapIcon
                            }}
                        />
                    </div>
                </div>
            </div>

            <style>
                {`
                @media (min-width: 1024px) {
                    .lg-layout { display: flex !important; }
                    .sm-md-layout { display: none !important; }
                }
                @media (max-width: 1023px) {
                    .lg-layout { display: none !important; }
                    .sm-md-layout { display: block !important; }
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                `}
            </style>
        </div>
    );
};

// Extracted form component for reuse
const SignUpFormContent = ({ 
    name, setName, email, setEmail, password, setPassword, role, setRole,
    showPassword, setShowPassword,
    touched, errors, submitError, loading,
    handleSubmit, onBlur,
    MailIcon, LockIcon, EyeIcon, EyeOffIcon, UserIcon, GraduationCapIcon
}) => (
    <div style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ marginBottom: '32px' }}>
            <h2 style={{ 
                fontSize: '24px', 
                fontWeight: '700', 
                color: '#03045E', 
                margin: '0 0 8px 0' 
            }}>
                Sign Up
            </h2>
            <p style={{ color: '#6b7280', margin: 0 }}>
                Create your account to get started
            </p>
        </div>

        <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
                <label
                    htmlFor="name"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#03045E',
                        marginBottom: '8px',
                    }}
                >
                    <UserIcon />
                    Full Name
                </label>
                <input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={() => onBlur('name')}
                    style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        border: `2px solid ${
                            touched.name && errors.name ? '#ef4444' : '#e5e7eb'
                        }`,
                        fontSize: '16px',
                        background: '#ffffff',
                        transition: 'all 0.2s ease',
                        outline: 'none',
                        boxSizing: 'border-box',
                    }}
                    onFocus={(e) => {
                        e.target.style.borderColor = '#0077B6';
                        e.target.style.boxShadow = '0 0 0 3px rgba(0, 119, 182, 0.1)';
                    }}
                    onBlurCapture={(e) => {
                        e.target.style.borderColor = touched.name && errors.name ? '#ef4444' : '#e5e7eb';
                        e.target.style.boxShadow = 'none';
                    }}
                />
                {touched.name && errors.name && (
                    <div style={{ color: '#ef4444', fontSize: '14px', marginTop: '6px' }}>
                        {errors.name}
                    </div>
                )}
            </div>

            <div>
                <label
                    htmlFor="email"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#03045E',
                        marginBottom: '8px',
                    }}
                >
                    <MailIcon />
                    Email Address
                </label>
                <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => onBlur('email')}
                    style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        border: `2px solid ${
                            touched.email && errors.email ? '#ef4444' : '#e5e7eb'
                        }`,
                        fontSize: '16px',
                        background: '#ffffff',
                        transition: 'all 0.2s ease',
                        outline: 'none',
                        boxSizing: 'border-box',
                    }}
                    onFocus={(e) => {
                        e.target.style.borderColor = '#0077B6';
                        e.target.style.boxShadow = '0 0 0 3px rgba(0, 119, 182, 0.1)';
                    }}
                    onBlurCapture={(e) => {
                        e.target.style.borderColor = touched.email && errors.email ? '#ef4444' : '#e5e7eb';
                        e.target.style.boxShadow = 'none';
                    }}
                />
                {touched.email && errors.email && (
                    <div style={{ color: '#ef4444', fontSize: '14px', marginTop: '6px' }}>
                        {errors.email}
                    </div>
                )}
            </div>

            <div>
                <label 
                    htmlFor="password" 
                    style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px', 
                        fontSize: '14px', 
                        fontWeight: '600', 
                        color: '#03045E',
                        marginBottom: '8px'
                    }}
                >
                    <LockIcon />
                    Password
                </label>
                <div style={{ position: 'relative' }}>
                    <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onBlur={() => onBlur('password')}
                        style={{
                            width: '100%',
                            padding: '12px 50px 12px 16px',
                            borderRadius: '8px',
                            border: `2px solid ${
                                touched.password && errors.password ? '#ef4444' : '#e5e7eb'
                            }`,
                            fontSize: '16px',
                            background: '#ffffff',
                            transition: 'all 0.2s ease',
                            outline: 'none',
                            boxSizing: 'border-box',
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = '#0077B6';
                            e.target.style.boxShadow = '0 0 0 3px rgba(0, 119, 182, 0.1)';
                        }}
                        onBlurCapture={(e) => {
                            e.target.style.borderColor = touched.password && errors.password ? '#ef4444' : '#e5e7eb';
                            e.target.style.boxShadow = 'none';
                        }}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                            position: 'absolute',
                            right: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            color: '#6b7280',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                </div>
                {touched.password && errors.password && (
                    <div style={{ color: '#ef4444', fontSize: '14px', marginTop: '6px' }}>
                        {errors.password}
                    </div>
                )}
            </div>

            <div>
                <label style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    fontSize: '14px', 
                    fontWeight: '600', 
                    color: '#03045E', 
                    marginBottom: '12px' 
                }}>
                    <UserIcon />
                    Role
                </label>
                <div style={{ display: 'flex', gap: '12px' }}>
                    {[
                        { key: 'student', label: 'Student', icon: <GraduationCapIcon /> },
                        { key: 'teacher', label: 'Teacher', icon: <UserIcon /> }
                    ].map((r) => (
                        <button
                            key={r.key}
                            type="button"
                            onClick={() => setRole(r.key)}
                            style={{
                                flex: 1,
                                padding: '12px',
                                borderRadius: '8px',
                                border: `2px solid ${role === r.key ? '#0077B6' : '#e5e7eb'}`,
                                background: role === r.key ? '#e8f4fd' : '#ffffff',
                                color: role === r.key ? '#0077B6' : '#6b7280',
                                fontWeight: '600',
                                fontSize: '14px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                            }}
                        >
                            {r.icon}
                            {r.label}
                        </button>
                    ))}
                </div>
            </div>

            {submitError && (
                <div
                    role="alert"
                    style={{
                        padding: '12px 16px',
                        borderRadius: '8px',
                        background: '#fef2f2',
                        border: '1px solid #fecaca',
                        color: '#ef4444',
                        fontSize: '14px',
                    }}
                >
                    {submitError}
                </div>
            )}

            <button
                type="submit"
                disabled={loading}
                style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '8px',
                    border: 'none',
                    background: loading 
                        ? 'linear-gradient(135deg, #0077B6aa 0%, #03045Eaa 100%)' 
                        : 'linear-gradient(135deg, #0077B6 0%, #03045E 100%)',
                    color: '#ffffff',
                    fontWeight: '600',
                    fontSize: '16px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: loading ? 'none' : '0 4px 12px rgba(3, 4, 94, 0.3)',
                }}
                onMouseEnter={(e) => {
                    if (!loading) {
                        e.target.style.transform = 'translateY(-1px)';
                        e.target.style.boxShadow = '0 6px 20px rgba(3, 4, 94, 0.4)';
                    }
                }}
                onMouseLeave={(e) => {
                    if (!loading) {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 12px rgba(3, 4, 94, 0.3)';
                    }
                }}
            >
                {loading ? (
                    <>
                        <div
                            style={{
                                width: '20px',
                                height: '20px',
                                border: '2px solid rgba(255,255,255,0.3)',
                                borderTopColor: '#ffffff',
                                borderRadius: '50%',
                                animation: 'spin 0.8s linear infinite',
                            }}
                        />
                        Signing up...
                    </>
                ) : (
                    'Sign Up'
                )}
            </button>
        </form>

        <div style={{ 
            textAlign: 'center', 
            marginTop: '24px', 
            fontSize: '14px', 
            color: '#6b7280' 
        }}>
            Already have an account?{' '}
            <a
                href="#"
                style={{
                    color: '#0077B6',
                    textDecoration: 'none',
                    fontWeight: '600',
                }}
            >
                Sign in
            </a>
        </div>
    </div>
);

export default SignUpForm;