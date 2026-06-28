import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Button from '../../components/common/Button';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Email address is required');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setError('');
    setSuccess(true);
    setEmail('');
  };

  return (
    <div className="min-h-screen flex font-body bg-white">
      {/* LEFT PANEL: 45% Image (Hidden on mobile) */}
      <div className="hidden md:flex md:w-[40%] lg:w-[45%] relative shrink-0">
        <img
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"
          alt="Casa Mare Luxury Home"
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
            <span>Casa Mare</span>
          </Link>

          {/* Tagline */}
          <div className="space-y-4">
            <h2 className="text-3xl lg:text-4xl font-heading font-extrabold leading-tight">
              Restore your <span className="text-primary">access</span>
            </h2>
            <p className="text-sm text-white/80 leading-relaxed max-w-sm">
              Enter your email address and we will send you instructions to reset your password.
            </p>
            {/* Dots */}
            <div className="flex space-x-2">
              <span className="w-6 h-2 bg-primary rounded-pill"></span>
              <span className="w-2 h-2 bg-white rounded-full"></span>
              <span className="w-2 h-2 bg-white rounded-full"></span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: 55% Form */}
      <div className="w-full md:w-[60%] lg:w-[55%] flex flex-col justify-between p-6 sm:p-10 md:p-16 relative overflow-y-auto">
        {/* Top Header Row */}
        <div className="flex justify-between items-center pb-6 border-b border-borderLight mb-10 shrink-0">
          <Link to="/" className="flex items-center space-x-2 font-heading font-extrabold text-lg text-darkGreen">
            <svg className="w-7 h-7 fill-current text-primary" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 21H5a2 2 0 0 1-2-2V9.586a1 1 0 0 1 .293-.707l7-7a1 1 0 0 1 1.414 0l7 7a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2zM12 4.414 5 11.414V19h14v-7.586L12 4.414z"/>
              <path d="M10 14h4v5h-4z"/>
            </svg>
            <span className="hidden sm:inline">Casa Mare</span>
          </Link>
          <Link
            to="/login"
            className="px-5 py-2 bg-darkGreen text-white rounded-pill text-xs font-heading font-bold hover:bg-primary transition-all shadow-sm flex items-center space-x-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </Link>
        </div>

        {/* Center Recovery Panel */}
        <div className="max-w-md w-full mx-auto my-auto py-8 space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-heading font-extrabold text-textDark">Reset Password</h2>
            <p className="text-sm text-textMuted leading-relaxed">
              Fill in your email address to search for your Casa Mare account.
            </p>
          </div>

          {success && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold p-4 rounded-card text-center flex flex-col items-center gap-2 animate-fade-in shadow-sm">
              <CheckCircle2 className="w-8 h-8 text-primary" />
              <span>Recovery link sent! Check your inbox for directions to reset.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-[11px] font-heading font-extrabold uppercase tracking-wider text-textMuted flex items-center gap-1.5 mb-2">
                <Mail className="w-4 h-4 text-primary" /> Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                placeholder="you@example.com"
                className={`w-full border rounded-btn px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all ${
                  error ? 'border-red-500 bg-red-50/5' : 'border-borderLight bg-white'
                }`}
              />
              {error && <p className="text-red-500 text-xs font-semibold mt-1.5">{error}</p>}
            </div>

            <Button type="submit" variant="primary" className="w-full py-3.5 mt-2 bg-darkGreen">
              Send Recovery Instructions
            </Button>
          </form>
        </div>

        {/* Bottom copyright */}
        <div className="text-center pt-8 text-[11px] text-textMuted/60 border-t border-borderLight mt-10 shrink-0">
          <span>© 2026 Casa Mare. Back to </span>
          <Link to="/" className="text-primary font-bold hover:underline">Home</Link>
        </div>

      </div>
    </div>
  );
};

export default ForgotPassword;
