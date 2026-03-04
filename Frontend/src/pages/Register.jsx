import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/register`, formData);
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (error) {
      alert('Registration failed. Email may already exist.');
    }
  };

  return (
    <div className="auth-container">
      <h2 style={{textAlign:'center', marginBottom: '20px'}}>Create Account</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name</label>
          <input type="text" placeholder="Bhavesh Giri" required
            onChange={e => setFormData({...formData, name: e.target.value})} />
        </div>
        <div className="form-group">
          <label>Email Address</label>
          <input type="email" placeholder="example@mail.com" required
            onChange={e => setFormData({...formData, email: e.target.value})} />
        </div>
        <div className="form-group">
          <label>Phone Number</label>
          <input type="tel" placeholder="10-digit mobile" required
            onChange={e => setFormData({...formData, phone: e.target.value})} />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" placeholder="Create password" required
            onChange={e => setFormData({...formData, password: e.target.value})} />
        </div>
        <button type="submit" className="btn-add">Register Now</button>
      </form>
      <p style={{marginTop: '15px', textAlign:'center', fontSize: '0.9rem'}}>
        Already have an account? <Link to="/login" style={{color: '#ea580c'}}>Login</Link>
      </p>
    </div>
  );
}

export default Register;