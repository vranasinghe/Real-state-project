import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';

export const Login = () => {
  const { signIn, redirectAfterLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Validation / Message states
  const [errors, setErrors] = useState({});
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [authError, setAuthError] = useState('');

  const validate = () => {
    const newErrors = {};
    
    // Email Check
    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Enter a valid email address (e.g. name@domain.com)';
    }

    // Password Check
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');

    if (validate()) {
      try {
        const res = await signIn(email, password);
        if (res.success) {
          setLoginSuccess(true);
          // Successful login transition
          setTimeout(() => {
            redirectAfterLogin(res.role);
          }, 1200);
        } else {
          setAuthError('Invalid credentials entered');
        }
      } catch (err) {
        setAuthError(err.message || 'An error occurred during sign in');
      }
    }
  };

  // OAuth triggers
  const handleGoogleLogin = () => {
    console.log('Google OAuth');
  };

  const handleFacebookLogin = () => {
    console.log('Facebook OAuth');
  };

  return (
    <div className="min-h-screen flex font-body bg-white">
      
      {/* LEFT PANEL: 45% Image (Hidden on mobile) */}
      <div className="hidden md:flex md:w-[40%] lg:w-[45%] relative shrink-0">
        <img
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"
          alt="Aura Spaces Dream Mansion"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,30,20,0.85)] via-[rgba(10,30,20,0.3)] to-[rgba(10,30,20,0.2)]"></div>
        
        {/* Branding & Overlay details */}
        <div className="absolute inset-0 p-10 flex flex-col justify-between z-10 text-white">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-white font-heading font-extrabold text-xl">
            <svg className="w-8 h-8 fill-current text-primary" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 21H5a2 2 0 0 1-2-2V9.586a1 1 0 0 1 .293-.707l7-7a1 1 0 0 1 1.414 0l7 7a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2zM12 4.414 5 11.414V19h14v-7.586L12 4.414z"/>
              <path d="M10 14h4v5h-4z"/>
            </svg>
            <span>Aura Spaces</span>
          </Link>

          {/* Bottom Content Tagline */}
          <div className="space-y-4">
            <h2 className="text-3xl lg:text-4xl font-heading font-extrabold leading-tight">
              Find your <span className="text-primary">dream</span> home
            </h2>
            <p className="text-sm text-white/80 leading-relaxed max-w-sm">
              Schedule visits in just a few clicks and discover premium properties with ease.
            </p>
            
            {/* 3 indicator dots (first dot = green pill, others = white circles) */}
            <div className="flex items-center space-x-2 pt-2">
              <span className="w-6 h-2 bg-primary rounded-pill"></span>
              <span className="w-2 h-2 bg-white rounded-full"></span>
              <span className="w-2 h-2 bg-white rounded-full"></span>
            </div>
          </div>
        </div>
      </div>


      {/* RIGHT PANEL: 55% Scrollable Form */}
      <div className="w-full md:w-[60%] lg:w-[55%] flex flex-col justify-between p-6 sm:p-10 md:p-16 relative overflow-y-auto">
        
        {/* Top bar header */}
        <div className="flex justify-between items-center pb-6 border-b border-borderLight mb-10 shrink-0">
          {/* Logo (for tablet/mobile sizes) */}
          <Link to="/" className="flex items-center space-x-2 font-heading font-extrabold text-lg text-darkGreen">
            <svg className="w-7 h-7 fill-current text-primary" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 21H5a2 2 0 0 1-2-2V9.586a1 1 0 0 1 .293-.707l7-7a1 1 0 0 1 1.414 0l7 7a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2zM12 4.414 5 11.414V19h14v-7.586L12 4.414z"/>
              <path d="M10 14h4v5h-4z"/>
            </svg>
            <span className="hidden sm:inline">Aura Spaces</span>
          </Link>
          
          <Link
            to="/register"
            className="px-6 py-2 bg-darkGreen hover:bg-primary text-white rounded-pill text-xs font-heading font-bold transition-all shadow-sm active:scale-95"
          >
            Register
          </Link>
        </div>

        {/* Center Login Form Panel */}
        <div className="max-w-md w-full mx-auto my-auto py-8 space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-heading font-extrabold text-textDark tracking-tight">Welcome Back!</h2>
            <p className="text-sm text-textMuted font-medium">Sign in to your account</p>
          </div>

          {/* Success / Auth Error notifications */}
          {authError && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs font-semibold p-3.5 rounded-btn text-center">
              {authError}
            </div>
          )}

          {loginSuccess && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold p-4 rounded-card text-center flex items-center justify-center gap-2 animate-fade-in shadow-sm">
              <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
              <span>Login Successful! Redirecting...</span>
            </div>
          )}

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-heading font-extrabold uppercase tracking-wider text-textMuted flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-primary shrink-0" /> Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                }}
                className={`w-full border rounded-btn px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white ${
                  errors.email ? 'border-red-500 bg-red-50/5' : 'border-borderLight'
                }`}
              />
              {errors.email && <p className="text-red-500 text-xs font-semibold mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-heading font-extrabold uppercase tracking-wider text-textMuted flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-primary shrink-0" /> Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                  }}
                  className={`w-full border rounded-btn pl-4 pr-11 py-3 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white ${
                    errors.password ? 'border-red-500 bg-red-50/5' : 'border-borderLight'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-textMuted hover:text-textDark focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs font-semibold mt-1">{errors.password}</p>}
            </div>

            {/* Remember Me and Forgot Link */}
            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center space-x-2 text-xs text-textMuted font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer"
                />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-xs font-semibold text-primary hover:underline">
                Forgot Password?
              </Link>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              variant="dark"
              className="w-full py-3.5 mt-4 hover:bg-primary font-heading font-extrabold uppercase tracking-wider text-sm transition-colors rounded-card duration-200"
            >
              Login
            </Button>
          </form>

          {/* Social Sign In Divider */}
          <div className="relative my-6 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-borderLight"></span>
            </div>
            <span className="relative bg-white px-4 text-xs font-semibold uppercase tracking-wider text-textMuted">
              or continue with
            </span>
          </div>

          {/* Social buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={handleGoogleLogin}
              className="flex items-center justify-center space-x-2 border border-borderLight rounded-btn py-2.5 hover:bg-gray-50 active:scale-[0.98] transition-all bg-white text-xs font-bold text-textDark shadow-sm"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.77c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
              </svg>
              <span>Continue with Google</span>
            </button>

            <button
              onClick={handleFacebookLogin}
              className="flex items-center justify-center space-x-2 border border-borderLight rounded-btn py-2.5 hover:bg-gray-50 active:scale-[0.98] transition-all bg-white text-xs font-bold text-textDark shadow-sm"
            >
              <svg className="w-4 h-4 fill-[#1877F2] shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span>Continue with Facebook</span>
            </button>
          </div>

          <p className="text-center text-xs text-textMuted">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-primary hover:underline">
              Register
            </Link>
          </p>
        </div>

        {/* Bottom copyright footer */}
        <div className="text-center pt-8 text-[11px] text-textMuted/60 border-t border-borderLight mt-10 shrink-0">
          <span>© 2026 Aura Spaces. Back to </span>
          <Link to="/" className="text-primary font-bold hover:underline">Home</Link>
        </div>

      </div>

    </div>
  );
};

export default Login;
