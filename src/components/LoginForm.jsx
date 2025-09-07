import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';

const icons = {
    Mail: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
        </svg>
    ),
    Lock: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <circle cx="12" cy="16" r="1" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
    ),
    Eye: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    ),
    EyeOff: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
            <line x1="1" y1="1" x2="23" y2="23" />
            <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
        </svg>
    ),
    User: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    ),
    Graduation: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
    ),
};

const validate = (email, password) => {
    const e = {};
    if (!email.trim()) e.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(email)) e.email = 'Please enter a valid email address';
    if (!password) e.password = 'Password is required';
    else if (password.length < 6) e.password = 'Password must be at least 6 characters long';
    return e;
};

const LoginFormContent = ({
    email, setEmail, password, setPassword, role, setRole,
    showPassword, setShowPassword, remember, setRemember,
    touched, errors, submitError, loading,
    handleSubmit, onBlur, idPrefix = ""
}) => (
    <div className="w-full max-w-[400px]">
        <div className="mb-8">
            <h2 className="text-[24px] font-bold text-[#03045E] mb-2">Sign In</h2>
            <p className="text-[#6b7280] m-0">Enter your credentials to access your account</p>
        </div>
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
            <div>
                <label htmlFor={`${idPrefix}email`} className="flex items-center gap-2 text-[14px] font-semibold text-[#03045E] mb-2">
                    {icons.Mail} Email Address
                </label>
                <input
                    id={`${idPrefix}email`}
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onBlur={() => onBlur('email')}
                    className={`w-full p-3 rounded-lg border-2 text-[16px] bg-white transition-all outline-none box-border ${touched.email && errors.email ? 'border-[#ef4444]' : 'border-[#e5e7eb]'
                        } focus:border-[#0077B6] focus:shadow-[0_0_0_3px_rgba(0,119,182,0.1)]`}
                />
                {touched.email && errors.email && (
                    <div className="text-[#ef4444] text-[14px] mt-1">{errors.email}</div>
                )}
            </div>
            <div>
                <div className="flex justify-between items-center mb-2">
                    <label htmlFor={`${idPrefix}password`} className="flex items-center gap-2 text-[14px] font-semibold text-[#03045E]">
                        {icons.Lock} Password
                    </label>
                    <button
                        type="button"
                        onClick={() => alert('Forgot password feature coming soon')}
                        className="bg-none border-none text-[#0077B6] text-[14px] cursor-pointer font-medium"
                    >
                        Forgot password?
                    </button>
                </div>
                <div className="relative">
                    <input
                        id={`${idPrefix}password`}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        onBlur={() => onBlur('password')}
                        className={`w-full pr-12 pl-4 py-3 rounded-lg border-2 text-[16px] bg-white transition-all outline-none box-border ${touched.password && errors.password ? 'border-[#ef4444]' : 'border-[#e5e7eb]'
                            } focus:border-[#0077B6] focus:shadow-[0_0_0_3px_rgba(0,119,182,0.1)]`}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(v => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-none border-none text-[#6b7280] cursor-pointer flex items-center"
                    >
                        {showPassword ? icons.EyeOff : icons.Eye}
                    </button>
                </div>
                {touched.password && errors.password && (
                    <div className="text-[#ef4444] text-[14px] mt-1">{errors.password}</div>
                )}
            </div>
            <div>
                <label className="flex items-center gap-2 text-[14px] font-semibold text-[#03045E] mb-3">
                    {icons.User} Role
                </label>
                <div className="flex gap-3">
                    {[
                        { key: 'student', label: 'Student', icon: icons.Graduation },
                        { key: 'teacher', label: 'Teacher', icon: icons.User },
                    ].map(r => (
                        <button
                            key={r.key}
                            type="button"
                            onClick={() => setRole(r.key)}
                            className={`flex-1 p-3 rounded-lg border-2 font-semibold text-[14px] cursor-pointer flex items-center justify-center gap-2 transition-all ${role === r.key
                                ? 'border-[#0077B6] bg-[#e8f4fd] text-[#0077B6]'
                                : 'border-[#e5e7eb] bg-white text-[#6b7280]'
                                }`}
                        >
                            {r.icon} {r.label}
                        </button>
                    ))}
                </div>
            </div>
            <label className="flex items-center gap-3 text-[14px] text-[#03045E] cursor-pointer">
                <input
                    type="checkbox"
                    checked={remember}
                    onChange={e => setRemember(e.target.checked)}
                    className="w-[18px] h-[18px] accent-[#0077B6] cursor-pointer"
                />
                Remember me for 30 days
            </label>
            {submitError && (
                <div role="alert" className="p-3 rounded-lg bg-[#fef2f2] border border-[#fecaca] text-[#ef4444] text-[14px]">
                    {submitError}
                </div>
            )}
            <button
                type="submit"
                disabled={loading}
                className={`w-full py-3.5 rounded-lg border-none font-semibold text-[16px] flex items-center justify-center gap-2 transition-all ${loading
                    ? 'bg-gradient-to-r from-[#0077B6aa] to-[#03045Eaa] cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#0077B6] to-[#03045E] cursor-pointer shadow-[0_4px_12px_rgba(3,4,94,0.3)] hover:shadow-[0_6px_20px_rgba(3,4,94,0.4)] hover:-translate-y-[1px]'
                    } text-white`}
            >
                {loading ? (
                    <>
                        <div className="w-5 h-5 border-2 border-[rgba(255,255,255,0.3)] border-t-white rounded-full animate-spin" />
                        Signing in...
                    </>
                ) : (
                    'Sign In'
                )}
            </button>
        </form>
        <div className="text-center mt-6 text-[14px] text-[#6b7280]">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[#0077B6] no-underline font-semibold hover:underline">
                Create account
            </Link>
        </div>
    </div>
);

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student');
    const [showPassword, setShowPassword] = useState(false);
    const [remember, setRemember] = useState(false);
    const [touched, setTouched] = useState({});
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    // Use authentication context
    const { login, isLoading, error: authError, clearError, isAuthenticated, user: authUser } = useAuth();
    const [submitError, setSubmitError] = useState('');

    // Redirect if already authenticated
    useEffect(() => {
        console.log('LoginForm useEffect: isAuthenticated =', isAuthenticated, 'user role from auth =', authUser?.role, 'form role =', role);
        if (isAuthenticated && authUser) {
            const userRole = authUser.role || role; // Use authenticated user's role, fallback to form role
            const targetRoute = userRole === 'teacher' ? '/teacher' : '/student';
            console.log('Redirecting to:', targetRoute, 'based on role:', userRole);
            navigate(targetRoute);
        }
    }, [isAuthenticated, role, navigate, authUser]);

    // Clear errors when component mounts or when user starts typing
    useEffect(() => {
        clearError();
    }, []); // Empty dependency array to run only once

    // Handle auth error changes
    useEffect(() => {
        if (authError) {
            setSubmitError(authError);
        }
    }, [authError]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Clear previous errors
        setSubmitError('');
        clearError();

        // Validate form
        setTouched({ email: true, password: true });
        const validationErrors = validate(email, password);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length) {
            return;
        }

        try {
            // Attempt login
            console.log('Attempting login with credentials:', { email: email.trim(), role });

            await login({
                email: email.trim(),
                password,
                role
            });

            // Navigation will be handled by the useEffect above
            console.log('Login successful, checking authentication state...');
            console.log('isAuthenticated after login:', isAuthenticated);

        } catch (error) {
            console.error('Login failed:', error.message);

            // Check if error indicates user doesn't exist
            if (error.message.toLowerCase().includes('user not found') ||
                error.message.toLowerCase().includes('user does not exist') ||
                error.message.toLowerCase().includes('no user found')) {

                // Redirect to signup page
                alert('User not found. Please create an account first.');
                navigate('/signup');
            } else {
                // Show other errors normally
                setSubmitError(error.message || 'Login failed. Please try again.');
            }
        }
    };

    const onBlur = (field) => {
        setTouched(t => ({ ...t, [field]: true }));
        setErrors(validate(email, password));
    };

    return (
        <div className="font-sans">
            <div className="hidden lg:flex min-h-screen">
                <div className="flex-1 bg-cover bg-center flex items-center justify-center p-10"
                    style={{
                        backgroundImage:
                            "linear-gradient(135deg, rgba(202,240,248,0.8) 0%, rgba(144,224,239,0.8) 50%, rgba(0,180,216,0.8) 100%), url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80')"
                    }}>
                    <div className="text-center text-white max-w-[500px]">
                        <div className="w-[120px] h-[120px] rounded-3xl bg-white/20 backdrop-blur-lg mx-auto mb-8 flex items-center justify-center border border-white/30">
                            <span className="text-[48px]">🎓</span>
                        </div>
                        <h1 className="text-[48px] font-extrabold mb-4 bg-gradient-to-r from-white to-[#CAF0F8] bg-clip-text text-transparent">
                            Level Up Your Learning
                        </h1>
                        <p className="text-[20px] opacity-90 leading-relaxed">
                            Join thousands of students and teachers transforming education through interactive learning experiences.
                        </p>
                    </div>
                </div>
                <div className="flex-1 bg-white flex items-center justify-center p-10 min-h-screen">
                    <LoginFormContent
                        {...{
                            email, setEmail, password, setPassword, role, setRole,
                            showPassword, setShowPassword, remember, setRemember,
                            touched, errors, submitError, loading: isLoading,
                            handleSubmit, onBlur, idPrefix: "desktop-"
                        }}
                    />
                </div>
            </div>
            <div className="block lg:hidden">
                <div className="min-h-[40vh] bg-cover bg-center flex items-center justify-center p-5 relative"
                    style={{
                        backgroundImage:
                            "linear-gradient(135deg, rgba(202,240,248,0.8) 0%, rgba(144,224,239,0.8) 50%, rgba(0,180,216,0.8) 100%), url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80')"
                    }}>
                    <div className="text-center text-white z-10">
                        <div className="w-[80px] h-[80px] rounded-2xl bg-white/20 backdrop-blur-lg mx-auto mb-5 flex items-center justify-center border border-white/30">
                            <span className="text-[32px]">🎓</span>
                        </div>
                        <h1 className="text-[28px] font-extrabold mb-2 drop-shadow">Welcome Back</h1>
                        <p className="text-[16px] opacity-90">Sign in to continue your learning journey</p>
                    </div>
                </div>
                <div className="bg-white p-10 pt-10 min-h-[60vh]">
                    <div className="max-w-[400px] mx-auto">
                        <LoginFormContent
                            {...{
                                email, setEmail, password, setPassword, role, setRole,
                                showPassword, setShowPassword, remember, setRemember,
                                touched, errors, submitError, loading: isLoading,
                                handleSubmit, onBlur, idPrefix: "mobile-"
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
