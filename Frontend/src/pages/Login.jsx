import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      // Logic for Bhavesh admin email: bhavesh@gmail.com
      if (email === 'bhavesh@gmail.com') navigate('/admin');
      else navigate('/');
    } catch (err) { alert('Login Failed'); }
  };

  return (
    <div className="auth-container">
      <h2 style={{textAlign:'center', marginBottom: '20px'}}>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="btn-add">Login</button>
      </form>
      <p style={{marginTop: '15px', textAlign:'center', fontSize: '0.9rem'}}>
        New here? <Link to="/register" style={{color: '#ea580c'}}>Register</Link>
      </p>
    </div>
  );
}

export default Login;