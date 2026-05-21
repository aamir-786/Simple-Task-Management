import React, { useState } from 'react';
import { Mail, Lock, User, AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { loginAPI, registerAPI } from '../api';
import './AuthForm.css';

function AuthForm({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (isLogin) {
        const data = await loginAPI({ username, password });
        onLogin(data.user, data.token);
      } else {
        const data = await registerAPI({ name, username, password });
        setSuccessMsg(data.message);
        setIsLogin(true); // Switch to login view
        setPassword('');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <h2 className="auth-title">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p className="auth-subtitle">
            {isLogin ? 'Enter your details to access your tasks.' : 'Sign up to start organizing your life.'}
          </p>
        </div>

        {error && (
          <div className="auth-alert error">
            <AlertCircle size={20} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="auth-alert success">
            <CheckCircle2 size={20} style={{ flexShrink: 0 }} />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="auth-input-group">
              <input 
                type="text" 
                className="auth-input" 
                placeholder="Full Name"
                value={name} 
                onChange={e => setName(e.target.value)} 
                required={!isLogin} 
              />
              <User className="auth-icon" size={20} />
            </div>
          )}

          <div className="auth-input-group">
            <input 
              type="email" 
              className="auth-input" 
              placeholder="Email Address"
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              required 
            />
            <Mail className="auth-icon" size={20} />
          </div>

          <div className="auth-input-group">
            <input 
              type={showPassword ? "text" : "password"} 
              className="auth-input" 
              placeholder="Password"
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
            />
            <Lock className="auth-icon" size={20} />
            <button 
              type="button" 
              className="auth-eye-btn" 
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
        </form>

        <div className="auth-toggle">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button 
            onClick={() => { 
              setIsLogin(!isLogin); 
              setError(''); 
              setSuccessMsg(''); 
            }} 
            type="button"
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthForm;
