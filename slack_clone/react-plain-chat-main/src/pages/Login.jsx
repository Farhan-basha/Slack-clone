
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const loggedInUser = localStorage.getItem('pulseVerseUser');
    if (loggedInUser) {
      navigate('/app');
    }
  }, [navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login process
    setTimeout(() => {
      // Simple validation
      if (email && password) {
        // Store user info in localStorage
        localStorage.setItem('pulseVerseUser', JSON.stringify({ 
          email, 
          name: email.split('@')[0] 
        }));
        
        // Navigate to main app
        navigate('/app');
      } else {
        alert("Please enter both email and password");
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="auth-container">
      <div className="auth-logo">
        <img 
          src="/lovable-uploads/dda17b43-48de-422b-b48b-79bd7b88388c.png" 
          alt="PulseVerse Logo"
          className="new-logo"
        />
      </div>

      <h1 className="auth-title">Sign in to PulseVerse</h1>
      
      <div className="auth-card">
        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="form-control"
              placeholder="name@work-email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="form-control"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button 
            className="auth-button"
            type="submit" 
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Login"}
          </button>
          
          <div className="auth-footer">
            Not a User? <Link to="/register" className="auth-link">Register</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
