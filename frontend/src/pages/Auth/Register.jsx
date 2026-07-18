import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, DollarSign, Award, Building, User, Mail, Lock, ShieldCheck, 
  Eye, EyeOff, CheckCircle2 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import PasswordStrengthBar from '../../components/common/PasswordStrengthBar';

export const Register = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  // Selected Role states
  const [selectedRole, setSelectedRole] = useState('buyer');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Form payload
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agencyName: '',     // seller only
    licenseNumber: '',  // agent only
    termsAccepted: false,
    role: 'buyer'
  });

  // Validation / Message states
  const [errors, setErrors] = useState({});
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [authError, setAuthError] = useState('');

  const handleRoleSelect = (roleName) => {
    setSelectedRole(roleName);
    setFormData(prev => ({
      ...prev,
      role: roleName
    }));
    // Clear validation errors for conditional fields on swap
    setErrors(prev => ({
      ...prev,
      agencyName: '',
      licenseNumber: ''
    }));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear errors inline when typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    // Name validations
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }

    // Password validation (min 8 chars, 1 uppercase, 1 number)
    const pwd = formData.password;
    if (!pwd) {
      newErrors.password = 'Password is required';
    } else {
      if (pwd.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      }
      if (!/[A-Z]/.test(pwd)) {
        newErrors.password = (newErrors.password ? newErrors.password + '. ' : '') + 'Must contain 1 uppercase letter';
      }
      if (!/\d/.test(pwd)) {
        newErrors.password = (newErrors.password ? newErrors.password + '. ' : '') + 'Must contain 1 number';
      }
    }

    // Confirm Password
    if (formData.confirmPassword !== pwd) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Role-based validations
    if (selectedRole === 'agent' && !formData.licenseNumber.trim()) {
      newErrors.licenseNumber = 'License number is required for agents';
    } else if (selectedRole === 'agent' && formData.licenseNumber.trim().length < 6) {
      newErrors.licenseNumber = 'License number must be at least 6 characters';
    }

    // Terms check
    if (!formData.termsAccepted) {
      newErrors.termsAccepted = 'You must accept the terms of service';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');

    if (validate()) {
      try {
        const res = await signUp(formData.email, formData.password, {
          full_name: `${formData.firstName} ${formData.lastName}`,
          role: formData.role
        });

        if (res.success) {
          setRegisterSuccess(true);
          setTimeout(() => {
            navigate('/');
          }, 1200);
        }
      } catch (err) {
        setAuthError(err.message || 'An error occurred during registration');
      }
    }
  };

  // Get dynamic button label
  const getButtonLabel = () => {
    if (selectedRole === 'buyer') return 'Create Buyer Account';
    if (selectedRole === 'seller') return 'Create Seller Account';
    return 'Create Agent Account';
  };

  return (
    <div className="min-h-screen flex font-body bg-white">
      
      {/* LEFT PANEL: 45% Image (Hidden on mobile) */}
      <div className="hidden md:flex md:w-[40%] lg:w-[45%] relative shrink-0">
        <img
          src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80"
          alt="Aura Spaces Exterior Real Estate"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,30,20,0.85)] via-[rgba(10,30,20,0.3)] to-[rgba(10,30,20,0.2)]"></div>
        
        {/* Branding & Overlay details */}
        <div className="absolute inset-0 p-10 flex flex-col justify-between z-10 text-white">
          <Link to="/" className="flex items-center space-x-2 text-white font-heading font-extrabold text-xl">
            <svg className="w-8 h-8 fill-current text-primary" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 21H5a2 2 0 0 1-2-2V9.586a1 1 0 0 1 .293-.707l7-7a1 1 0 0 1 1.414 0l7 7a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2zM12 4.414 5 11.414V19h14v-7.586L12 4.414z"/>
              <path d="M10 14h4v5h-4z"/>
            </svg>
            <span>Aura Spaces</span>
          </Link>

          <div className="space-y-4">
            <h2 className="text-3xl lg:text-4xl font-heading font-extrabold leading-tight">
              Find your <span className="text-primary">dream</span> home
            </h2>
            <p className="text-sm text-white/80 leading-relaxed max-w-sm">
              Schedule visits in just a few clicks and discover premium properties with ease.
            </p>
            {/* Dots */}
            <div className="flex space-x-2">
              <span className="w-2 h-2 bg-white rounded-full"></span>
              <span className="w-6 h-2 bg-primary rounded-pill"></span>
              <span className="w-2 h-2 bg-white rounded-full"></span>
            </div>
          </div>
        </div>
      </div>


      {/* RIGHT PANEL: 55% Scrollable Form */}
      <div className="w-full md:w-[60%] lg:w-[55%] flex flex-col justify-between p-6 sm:p-10 md:p-16 relative overflow-y-auto">
        
        {/* Top bar header */}
        <div className="flex justify-between items-center pb-6 border-b border-borderLight mb-10 shrink-0">
          <Link to="/" className="flex items-center space-x-2 font-heading font-extrabold text-lg text-darkGreen">
            <svg className="w-7 h-7 fill-current text-primary" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 21H5a2 2 0 0 1-2-2V9.586a1 1 0 0 1 .293-.707l7-7a1 1 0 0 1 1.414 0l7 7a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2zM12 4.414 5 11.414V19h14v-7.586L12 4.414z"/>
              <path d="M10 14h4v5h-4z"/>
            </svg>
            <span className="hidden sm:inline">Aura Spaces</span>
          </Link>
          
          <Link
            to="/login"
            className="px-6 py-2 bg-darkGreen hover:bg-primary text-white rounded-pill text-xs font-heading font-bold transition-all shadow-sm active:scale-95"
          >
            Sign in
          </Link>
        </div>

        {/* Center Signup Form Panel */}
        <div className="max-w-xl w-full mx-auto my-auto py-6 space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-heading font-bold text-textDark">Create account</h2>
            <p className="text-xs text-textMuted">Join Aura Spaces — it's free</p>
          </div>

          {registerSuccess && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold p-4 rounded-card text-center flex items-center justify-center gap-2 animate-fade-in shadow-sm">
              <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
              <span>Account Registered Successfully! Redirecting...</span>
            </div>
          )}

          {authError && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs font-semibold p-3.5 rounded-btn text-center">
              {authError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* STEP 1: ROLE SELECTOR */}
            <div className="space-y-3">
              <label className="text-[10px] font-heading font-extrabold uppercase tracking-wider text-textMuted block">
                I am a
              </label>
              
              <div className="grid grid-cols-3 gap-3">
                {/* Buyer Card */}
                <button
                  type="button"
                  onClick={() => handleRoleSelect('buyer')}
                  className={`border-1.5 rounded-[10px] p-3.5 text-center flex flex-col items-center justify-center space-y-1 bg-white cursor-pointer transition-all ${
                    selectedRole === 'buyer'
                      ? 'bg-primary-light border-primary text-primary'
                      : 'border-borderLight hover:bg-gray-50 text-textMuted'
                  }`}
                >
                  <Search className={`w-5 h-5 ${selectedRole === 'buyer' ? 'text-primary' : 'text-textMuted'}`} />
                  <span className="text-[12px] font-bold">Buyer</span>
                  <span className="text-[10px] text-textMuted leading-tight font-medium">Find & purchase</span>
                </button>

                {/* Seller Card */}
                <button
                  type="button"
                  onClick={() => handleRoleSelect('seller')}
                  className={`border-1.5 rounded-[10px] p-3.5 text-center flex flex-col items-center justify-center space-y-1 bg-white cursor-pointer transition-all ${
                    selectedRole === 'seller'
                      ? 'bg-primary-light border-primary text-primary'
                      : 'border-borderLight hover:bg-gray-50 text-textMuted'
                  }`}
                >
                  <DollarSign className={`w-5 h-5 ${selectedRole === 'seller' ? 'text-primary' : 'text-textMuted'}`} />
                  <span className="text-[12px] font-bold">Seller</span>
                  <span className="text-[10px] text-textMuted leading-tight font-medium">List & sell prop.</span>
                </button>

                {/* Agent Card */}
                <button
                  type="button"
                  onClick={() => handleRoleSelect('agent')}
                  className={`border-1.5 rounded-[10px] p-3.5 text-center flex flex-col items-center justify-center space-y-1 bg-white cursor-pointer transition-all ${
                    selectedRole === 'agent'
                      ? 'bg-primary-light border-primary text-primary'
                      : 'border-borderLight hover:bg-gray-50 text-textMuted'
                  }`}
                >
                  <Award className={`w-5 h-5 ${selectedRole === 'agent' ? 'text-primary' : 'text-textMuted'}`} />
                  <span className="text-[12px] font-bold">Agent</span>
                  <span className="text-[10px] text-textMuted leading-tight font-medium">Represent client</span>
                </button>
              </div>
            </div>

            {/* CONDITIONAL EXTRA FIELD */}
            {selectedRole === 'seller' && (
              <div className="space-y-1.5 animate-fade-in">
                <label className="text-[10px] font-heading font-extrabold uppercase tracking-wider text-textMuted flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-primary shrink-0" /> Agency / Company name (optional)
                </label>
                <input
                  type="text"
                  name="agencyName"
                  value={formData.agencyName}
                  onChange={handleInputChange}
                  placeholder="e.g. Realty Partners LLC"
                  className="w-full border border-borderLight rounded-btn px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white transition-all"
                />
              </div>
            )}

            {selectedRole === 'agent' && (
              <div className="space-y-1.5 animate-fade-in">
                <label className="text-[10px] font-heading font-extrabold uppercase tracking-wider text-textMuted flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-primary shrink-0" /> License number
                </label>
                <input
                  type="text"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleInputChange}
                  placeholder="e.g. RE-2024-00123"
                  className={`w-full border rounded-btn px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white transition-all ${
                    errors.licenseNumber ? 'border-red-500 bg-red-50/5' : 'border-borderLight'
                  }`}
                />
                {errors.licenseNumber && <p className="text-red-500 text-xs font-semibold mt-1">{errors.licenseNumber}</p>}
              </div>
            )}


            {/* STEP 2: PERSONAL INFO */}
            <div className="space-y-4">
              
              {/* Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-heading font-extrabold uppercase tracking-wider text-textMuted flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-primary shrink-0" /> First name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="John"
                    className={`w-full border rounded-btn px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white transition-all ${
                      errors.firstName ? 'border-red-500 bg-red-50/5' : 'border-borderLight'
                    }`}
                  />
                  {errors.firstName && <p className="text-red-500 text-xs font-semibold mt-1">{errors.firstName}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-heading font-extrabold uppercase tracking-wider text-textMuted flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-primary shrink-0" /> Last name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Doe"
                    className={`w-full border rounded-btn px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white transition-all ${
                      errors.lastName ? 'border-red-500 bg-red-50/5' : 'border-borderLight'
                    }`}
                  />
                  {errors.lastName && <p className="text-red-500 text-xs font-semibold mt-1">{errors.lastName}</p>}
                </div>
              </div>

              {/* Email address */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-heading font-extrabold uppercase tracking-wider text-textMuted flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-primary shrink-0" /> Email address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="johndoe@example.com"
                  className={`w-full border rounded-btn px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white transition-all ${
                    errors.email ? 'border-red-500 bg-red-50/5' : 'border-borderLight'
                  }`}
                />
                {errors.email && <p className="text-red-500 text-xs font-semibold mt-1">{errors.email}</p>}
              </div>

              {/* Passwords */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Password field */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-heading font-extrabold uppercase tracking-wider text-textMuted flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-primary shrink-0" /> Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Min 8 chars"
                      className={`w-full border rounded-btn pl-4 pr-10 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white transition-all ${
                        errors.password ? 'border-red-500 bg-red-50/5' : 'border-borderLight'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-textMuted hover:text-textDark focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {/* Strength Bar Component */}
                  <PasswordStrengthBar password={formData.password} />
                  {errors.password && <p className="text-red-500 text-xs font-semibold mt-1">{errors.password}</p>}
                </div>

                {/* Confirm password */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-heading font-extrabold uppercase tracking-wider text-textMuted flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-primary shrink-0" /> Confirm password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Repeat password"
                      className={`w-full border rounded-btn pl-4 pr-10 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white transition-all ${
                        errors.confirmPassword ? 'border-red-500 bg-red-50/5' : 'border-borderLight'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-textMuted hover:text-textDark focus:outline-none"
                    >
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-red-500 text-xs font-semibold mt-1">{errors.confirmPassword}</p>}
                </div>

              </div>

            </div>


            {/* STEP 3: TERMS & SUBMIT */}
            <div className="space-y-4 pt-2">
              <label className="flex items-start space-x-2.5 text-xs text-textMuted font-medium cursor-pointer">
                <input
                  type="checkbox"
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary focus:ring-offset-0 mt-0.5 cursor-pointer"
                />
                <span className="leading-tight">
                  I agree to the{' '}
                  <a href="#" className="text-primary font-bold hover:underline">Terms of Service</a> and{' '}
                  <a href="#" className="text-primary font-bold hover:underline">Privacy Policy</a>
                </span>
              </label>
              {errors.termsAccepted && <p className="text-red-500 text-xs font-semibold mt-1">{errors.termsAccepted}</p>}

              <Button
                type="submit"
                variant="dark"
                className="w-full py-3.5 hover:bg-primary font-heading font-extrabold uppercase tracking-wider text-sm transition-colors rounded-card duration-200"
              >
                {getButtonLabel()}
              </Button>
            </div>

          </form>

          <p className="text-center text-xs text-textMuted mt-4">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary hover:underline">
              Sign in
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

export default Register;
