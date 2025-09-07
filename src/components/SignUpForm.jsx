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

const imageUrl = "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=800&q=80";

const validate = ({ name, email, password }) => {
    const e = {};
    if (!name.trim()) e.name = 'Full name is required';
    else if (name.trim().length < 2) e.name = 'Name must be at least 2 characters long';
    if (!email.trim()) e.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(email)) e.email = 'Please enter a valid email address';
    if (!password) e.password = 'Password is required';
    else if (password.length < 6) e.password = 'Password must be at least 6 characters long';
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) e.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    return e;
};

const SignUpForm = () => {
    const [form, setForm] = useState({
        email: '',
        password: '',
        name: '',
        role: 'student',
        grade: '',
        subject: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [touched, setTouched] = useState({});
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    // Use authentication context
    const { register, isLoading, error: authError, clearError, isAuthenticated } = useAuth();
    const [submitError, setSubmitError] = useState('');

    // Clear errors when component mounts
    useEffect(() => {
        clearError();
    }, []); // Empty dependency array to run only once

    // Handle auth error changes
    useEffect(() => {
        if (authError) {
            setSubmitError(authError);
        }
    }, [authError]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));

        // Clear field error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleRole = (role) => {
        setForm(f => ({ ...f, role }));
        // Reset role-specific fields when role changes
        if (role === 'student') {
            setForm(f => ({ ...f, subject: '' }));
        } else {
            setForm(f => ({ ...f, grade: '' }));
        }
    };

    const handleBlur = (field) => {
        setTouched(t => ({ ...t, [field]: true }));
        setErrors(validate(form));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Clear previous errors
        setSubmitError('');
        clearError();

        // Validate form
        setTouched({ name: true, email: true, password: true });
        const validationErrors = validate(form);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length) {
            return;
        }

        try {
            // Attempt registration
            await register({
                name: form.name.trim(),
                email: form.email.trim(),
                password: form.password,
                role: form.role,
                ...(form.role === 'student' && form.grade && { grade: form.grade }),
                ...(form.role === 'teacher' && form.subject && { subject: form.subject })
            });

            // Show success message and redirect to login
            alert('Registration successful! Please login with your credentials.');
            navigate('/login');

        } catch (error) {
            // Error handling is managed by the auth context
            console.error('Registration failed:', error.message);
            setSubmitError(error.message || 'Registration failed. Please try again.');
        }
    };

    const FormContent = ({ idPrefix = "" }) => (
        <div className="w-full max-w-[400px]">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-[#03045E] mb-2">Sign Up</h2>
                <p className="text-gray-500 m-0">Create your account to get started</p>
            </div>
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
                {/* Name */}
                <div>
                    <label htmlFor={`${idPrefix}name`} className="flex items-center gap-2 text-sm font-semibold text-[#03045E] mb-2">
                        {icons.User} Full Name
                    </label>
                    <input
                        id={`${idPrefix}name`}
                        name="name"
                        type="text"
                        placeholder="Enter your name"
                        value={form.name}
                        onChange={handleChange}
                        onBlur={() => handleBlur('name')}
                        className={`w-full px-4 py-3 rounded-lg border-2 text-base bg-white transition-all outline-none box-border ${touched.name && errors.name ? 'border-red-500' : 'border-gray-200'
                            } focus:border-[#0077B6] focus:shadow-[0_0_0_3px_rgba(0,119,182,0.1)]`}
                    />
                    {touched.name && errors.name && (
                        <div className="text-red-500 text-sm mt-1">{errors.name}</div>
                    )}
                </div>
                {/* Email */}
                <div>
                    <label htmlFor={`${idPrefix}email`} className="flex items-center gap-2 text-sm font-semibold text-[#03045E] mb-2">
                        {icons.Mail} Email Address
                    </label>
                    <input
                        id={`${idPrefix}email`}
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        value={form.email}
                        onChange={handleChange}
                        onBlur={() => handleBlur('email')}
                        className={`w-full px-4 py-3 rounded-lg border-2 text-base bg-white transition-all outline-none box-border ${touched.email && errors.email ? 'border-red-500' : 'border-gray-200'
                            } focus:border-[#0077B6] focus:shadow-[0_0_0_3px_rgba(0,119,182,0.1)]`}
                    />
                    {touched.email && errors.email && (
                        <div className="text-red-500 text-sm mt-1">{errors.email}</div>
                    )}
                </div>
                {/* Password */}
                <div>
                    <label htmlFor={`${idPrefix}password`} className="flex items-center gap-2 text-sm font-semibold text-[#03045E] mb-2">
                        {icons.Lock} Password
                    </label>
                    <div className="relative">
                        <input
                            id={`${idPrefix}password`}
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            value={form.password}
                            onChange={handleChange}
                            onBlur={() => handleBlur('password')}
                            className={`w-full px-4 pr-12 py-3 rounded-lg border-2 text-base bg-white transition-all outline-none box-border ${touched.password && errors.password ? 'border-red-500' : 'border-gray-200'
                                } focus:border-[#0077B6] focus:shadow-[0_0_0_3px_rgba(0,119,182,0.1)]`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(s => !s)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 bg-none border-none text-gray-500 cursor-pointer flex items-center"
                            tabIndex={-1}
                        >
                            {showPassword ? icons.EyeOff : icons.Eye}
                        </button>
                    </div>
                    {touched.password && errors.password && (
                        <div className="text-red-500 text-sm mt-1">{errors.password}</div>
                    )}
                </div>
                {/* Role */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-[#03045E] mb-3">
                        {icons.User} Role
                    </label>
                    <div className="flex gap-3">
                        {[
                            { key: 'student', label: 'Student', icon: icons.Graduation },
                            { key: 'teacher', label: 'Teacher', icon: icons.User }
                        ].map(r => (
                            <button
                                key={r.key}
                                type="button"
                                onClick={() => handleRole(r.key)}
                                className={`flex-1 py-3 rounded-lg border-2 font-semibold text-sm cursor-pointer flex items-center justify-center gap-2 transition-all
                                    ${form.role === r.key ? 'border-[#0077B6] bg-[#e8f4fd] text-[#0077B6]' : 'border-gray-200 bg-white text-gray-500'}`}
                            >
                                {r.icon} {r.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Conditional Fields based on Role */}
                {form.role === 'student' && (
                    <div>
                        <label htmlFor="grade" className="flex items-center gap-2 text-sm font-semibold text-[#03045E] mb-2">
                            {icons.Graduation} Grade Level
                        </label>
                        <select
                            id="grade"
                            name="grade"
                            value={form.grade}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border-2 text-base bg-white transition-all outline-none box-border border-gray-200 focus:border-[#0077B6] focus:shadow-[0_0_0_3px_rgba(0,119,182,0.1)]"
                        >
                            <option value="">Select Grade Level (Optional)</option>
                            <option value="elementary">Elementary (K-5)</option>
                            <option value="middle">Middle School (6-8)</option>
                            <option value="high">High School (9-12)</option>
                            <option value="college">College/University</option>
                            <option value="graduate">Graduate School</option>
                        </select>
                    </div>
                )}

                {form.role === 'teacher' && (
                    <div>
                        <label htmlFor="subject" className="flex items-center gap-2 text-sm font-semibold text-[#03045E] mb-2">
                            {icons.User} Subject Area
                        </label>
                        <select
                            id="subject"
                            name="subject"
                            value={form.subject}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border-2 text-base bg-white transition-all outline-none box-border border-gray-200 focus:border-[#0077B6] focus:shadow-[0_0_0_3px_rgba(0,119,182,0.1)]"
                        >
                            <option value="">Select Subject Area (Optional)</option>
                            <option value="mathematics">Mathematics</option>
                            <option value="science">Science</option>
                            <option value="english">English/Language Arts</option>
                            <option value="history">History/Social Studies</option>
                            <option value="foreign_language">Foreign Language</option>
                            <option value="arts">Arts</option>
                            <option value="physical_education">Physical Education</option>
                            <option value="computer_science">Computer Science</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                )}
                {/* Error */}
                {submitError && (
                    <div role="alert" className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-500 text-sm">
                        {submitError}
                    </div>
                )}
                {/* Submit */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-3 rounded-lg border-none font-semibold text-base cursor-pointer flex items-center justify-center gap-2 transition-all
                        text-white shadow-lg
                        ${isLoading
                            ? 'bg-gradient-to-r from-[#0077B6aa] to-[#03045Eaa] cursor-not-allowed shadow-none'
                            : 'bg-gradient-to-r from-[#0077B6] to-[#03045E] hover:-translate-y-0.5 hover:shadow-xl'}`}
                >
                    {isLoading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-white/80 rounded-full animate-spin" />
                            Signing up...
                        </>
                    ) : 'Sign Up'}
                </button>
            </form>
            <div className="text-center mt-6 text-sm text-gray-500">
                Already have an account?{' '}
                <Link to="/login" className="text-[#0077B6] font-semibold no-underline hover:underline">
                    Sign in
                </Link>
            </div>
        </div>
    );

    return (
        <div className="font-sans">
            {/* Large screens */}
            <div className="hidden lg:flex min-h-screen">
                <div
                    className="flex-1 flex items-center justify-center p-10"
                    style={{
                        backgroundImage: `linear-gradient(135deg, rgba(202,240,248,0.8) 0%, rgba(144,224,239,0.8) 50%, rgba(0,180,216,0.8) 100%), url('${imageUrl}')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                >
                    <div className="text-center text-white max-w-[500px]">
                        <div className="w-[120px] h-[120px] rounded-3xl bg-white/20 backdrop-blur-lg mx-auto mb-8 flex items-center justify-center border border-white/30">
                            <span className="text-5xl">🚀</span>
                        </div>
                        <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-white to-[#CAF0F8] bg-clip-text text-transparent">
                            Start Your Learning Journey
                        </h1>
                        <p className="text-xl opacity-90 leading-relaxed">
                            Create your account and unlock a world of interactive education.
                        </p>
                    </div>
                </div>
                <div className="flex-1 bg-white flex items-center justify-center p-10 min-h-screen">
                    <FormContent idPrefix="desktop-" />
                </div>
            </div>
            {/* Small/medium screens */}
            <div className="block lg:hidden">
                <div
                    className="min-h-[40vh] flex items-center justify-center p-5 relative"
                    style={{
                        backgroundImage: `linear-gradient(135deg, rgba(202,240,248,0.8) 0%, rgba(144,224,239,0.8) 50%, rgba(0,180,216,0.8) 100%), url('${imageUrl}')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                >
                    <div className="text-center text-white z-10">
                        <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-lg mx-auto mb-5 flex items-center justify-center border border-white/30">
                            <span className="text-3xl">🚀</span>
                        </div>
                        <h1 className="text-2xl font-extrabold mb-2 drop-shadow">
                            Create Account
                        </h1>
                        <p className="text-base opacity-90">Sign up and start learning today!</p>
                    </div>
                </div>
                <div className="bg-white p-10 pt-5 min-h-[60vh]">
                    <div className="max-w-[400px] mx-auto"><FormContent idPrefix="mobile-" /></div>
                </div>
            </div>
        </div>
    );
};

export default SignUpForm;
