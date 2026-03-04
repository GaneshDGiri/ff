import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

function Navbar({ onOpenCheckout }) {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">🍔 FoodHub</Link>
      <div className="nav-links">
        <Link to="/">Menu</Link>
        {user ? (
          <>
            {user.role === 'admin' && <Link to="/admin">Owner</Link>}
            <button onClick={handleLogout} style={{background:'none', border:'none', color:'#4b5563', fontWeight:600, cursor:'pointer'}}>Logout</button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
        <button onClick={onOpenCheckout} className="btn-cart">
          Cart ({cartCount})
        </button>
      </div>
    </nav>
  );
}

export default Navbar;