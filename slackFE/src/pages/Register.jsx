
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/auth.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const loggedInUser = localStorage.getItem('pulseVerseUser');
    if (loggedInUser) {
      navigate('/app');
    }
  }, [navigate]);

  const handleRegister = (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (password !== confirmPassword) {
      alert("Passwords don't match");
      setIsLoading(false);
      return;
    }

    // Simulate registration process
    setTimeout(() => {
      // Store users in localStorage (in a real app, this would be in a database)
      const users = JSON.parse(localStorage.getItem('pulseVerseUsers') || '[]');
      
      // Check if user already exists
      const userExists = users.some(user => user.email === email);
      
      if (userExists) {
        alert("User with this email already exists");
        setIsLoading(false);
        return;
      }
      
      // Add new user
      users.push({ name, email, password });
      localStorage.setItem('pulseVerseUsers', JSON.stringify(users));
      
      alert("Registration successful! You can now log in.");
      
      // Navigate to login page
      navigate('/');
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

      <h1 className="auth-title">Register</h1>
      
      <div className="auth-card">
        <form onSubmit={handleRegister} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              className="form-control"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
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
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              className="form-control"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          
          <button 
            className="auth-button"
            type="submit" 
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Submit"}
          </button>
          
          <div className="auth-footer">
            Already a User? <Link to="/" className="auth-link">Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
