import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = localStorage.getItem('pulseVerseUser');
    if (loggedInUser) {
      navigate('/app');
    }
  }, [navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const registeredUsers = JSON.parse(localStorage.getItem('pulseVerseUsers') || '[]');
    const user = registeredUsers.find(u => u.email === email && u.password === password);

    setTimeout(() => {
      if (user) {
        localStorage.setItem('pulseVerseUser', JSON.stringify({
          email: user.email,
          name: user.name
        }));
        navigate('/app');
      } else {
        setError("Invalid email or password. Please check your credentials.");
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="auth-container">
      <div className="auth-logo">
        <img
          src="/pulseverse-uploads/dda17b43-48de-422b-b48b-79bd7b88388c.png"
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
            <div className="forgot-password-link">
              <Link to="/forgot-password" className="auth-link">Forgot password?</Link>
            </div>
          </div>

          {error && <div className="auth-error">{error}</div>}

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
