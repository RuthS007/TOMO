import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { Logo } from "./Logo";

interface AuthScreenProps {
  onSuccess: (email: string) => void;
  onQuickDemo: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onSuccess, onQuickDemo }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState("student@campus.edu");
  const [password, setPassword] = useState("••••••••");
  const [confirmPassword, setConfirmPassword] = useState("••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please enter a valid campus or student email address.");
      return;
    }
    if (!password || password.length < 4) {
      setError("Password should be at least 4 characters.");
      return;
    }
    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError(null);
    onSuccess(email);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#15123d] text-white px-4 py-8 overflow-hidden">
      {/* Ambient background glows matching Figma artwork */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md z-10">
        {/* Top Logo Container */}
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="mb-3 p-1 rounded-2xl bg-gradient-to-tr from-purple-600/30 to-teal-400/30 ring-1 ring-white/15 backdrop-blur-md">
            <Logo size="lg" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-center text-white">
            {isLogin ? "Welcome Back" : "Create Your Account"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300/80 mt-1 text-center">
            {isLogin
              ? "Sign in to connect with campus friends and buddies"
              : "Join your campus community & find your ideal buddies"}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-[#1b174a]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email field */}
            <div>
              <div className="relative flex items-center">
                <div className="absolute left-4 text-slate-400 pointer-events-none">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="auth-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email."
                  required
                  className="w-full pl-11 pr-4 py-3 bg-white text-slate-900 placeholder:text-slate-500 rounded-2xl font-medium text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 shadow-sm transition"
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <div className="relative flex items-center">
                <div className="absolute left-4 text-slate-400 pointer-events-none">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="auth-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password,"
                  required
                  className="w-full pl-11 pr-11 py-3 bg-white text-slate-900 placeholder:text-slate-500 rounded-2xl font-medium text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 shadow-sm transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-slate-400 hover:text-slate-600 focus:outline-none"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password field (for Sign Up) */}
            {!isLogin && (
              <div>
                <div className="relative flex items-center">
                  <div className="absolute left-4 text-slate-400 pointer-events-none">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="auth-confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password,"
                    required
                    className="w-full pl-11 pr-11 py-3 bg-white text-slate-900 placeholder:text-slate-500 rounded-2xl font-medium text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 shadow-sm transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 text-slate-400 hover:text-slate-600 focus:outline-none"
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Submit Button with Purple to Teal Gradient */}
            <button
              id="auth-submit-btn"
              type="submit"
              className="w-full py-3.5 px-6 rounded-2xl font-bold text-sm tracking-wider uppercase bg-gradient-to-r from-purple-600 via-indigo-600 to-teal-400 hover:from-purple-500 hover:to-teal-300 text-white shadow-lg shadow-purple-600/25 active:scale-[0.99] transition transform cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{isLogin ? "SIGN IN" : "CREATE"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* OR Divider */}
          <div className="relative flex items-center justify-center my-5">
            <div className="w-full border-t border-white/10" />
            <span className="absolute px-3 bg-[#1b174a] text-slate-400 text-xs font-semibold uppercase tracking-wider">
              OR
            </span>
          </div>

          {/* Social Logins styled exactly like Figma */}
          <div className="space-y-2.5">
            <button
              type="button"
              onClick={() => onSuccess("apple.student@campus.edu")}
              className="w-full py-2.5 px-4 bg-white hover:bg-slate-100 text-slate-800 font-medium text-xs rounded-2xl flex items-center justify-center gap-2.5 shadow-sm transition cursor-pointer"
            >
              {/* Apple icon */}
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 1.01-2.87-.9.04-2 .6-2.65 1.35-.58.65-1.09 1.71-1.01 2.76 1 .08 2.03-.49 2.65-1.24z" />
              </svg>
              <span>Sign in with Apple,</span>
            </button>

            <button
              type="button"
              onClick={() => onSuccess("google.student@campus.edu")}
              className="w-full py-2.5 px-4 bg-white hover:bg-slate-100 text-slate-800 font-medium text-xs rounded-2xl flex items-center justify-center gap-2.5 shadow-sm transition cursor-pointer"
            >
              {/* Google icon */}
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Sign in with Google,</span>
            </button>

            <button
              type="button"
              onClick={() => onSuccess("facebook.student@campus.edu")}
              className="w-full py-2.5 px-4 bg-white hover:bg-slate-100 text-slate-800 font-medium text-xs rounded-2xl flex items-center justify-center gap-2.5 shadow-sm transition cursor-pointer"
            >
              {/* Facebook icon */}
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span>Sign in with Facebook,</span>
            </button>
          </div>

          {/* Quick Demo button */}
          <div className="mt-4 pt-3 border-t border-white/5">
            <button
              type="button"
              onClick={onQuickDemo}
              className="w-full py-2 px-3 rounded-xl bg-teal-500/15 hover:bg-teal-500/25 border border-teal-500/30 text-teal-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Explore as Guest / Instant Demo</span>
            </button>
          </div>

          {/* Toggle between Login and Sign Up */}
          <div className="mt-5 text-center">
            <p className="text-xs text-slate-400">
              {isLogin ? "Don't have an account yet? " : "Already have an account? "}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError(null);
                }}
                className="text-teal-400 hover:text-teal-300 font-semibold underline underline-offset-2 ml-1 cursor-pointer"
              >
                {isLogin ? "Sign up." : "Log in."}
              </button>
            </p>
          </div>
        </div>

        {/* Footer Terms text matching Figma */}
        <p className="text-[11px] text-slate-400 text-center mt-5">
          By signing up, you agree to our{" "}
          <span className="text-teal-400 hover:underline cursor-pointer">Terms & Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
};
