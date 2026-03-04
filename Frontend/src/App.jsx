import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import CheckoutModal from './components/CheckoutModal';

function App() {
  // Global state for opening/closing the checkout modal
  const [isCheckoutOpen, setCheckoutOpen] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-sans">
        
        {/* Pass the toggle function to the Navbar */}
        <Navbar onOpenCheckout={() => setCheckoutOpen(true)} />
        
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            
            {/* Protected Owner Route */}
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>

        {/* Render the modal at the app level if it is open */}
        {isCheckoutOpen && (
          <CheckoutModal onClose={() => setCheckoutOpen(false)} />
        )}
        
      </div>
    </Router>
  );
}

export default App;