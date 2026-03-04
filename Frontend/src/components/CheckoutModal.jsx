import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

function CheckoutModal({ onClose }) {
  const { cart, clearCart, addToCart, removeFromCart } = useContext(CartContext);
  const { token, user } = useContext(AuthContext);
  
  // --- ADDRESS STATES ---
  const [address, setAddress] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [isEditing, setIsEditing] = useState(true);
  
  // --- PAYMENT STATES ---
  const [mainMethod, setMainMethod] = useState('COD'); // COD or ONLINE
  const [onlineSubMethod, setOnlineSubMethod] = useState('upi_app'); // card, upi, upi_app
  const [loading, setLoading] = useState(false);

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  // Auto-load user address if it exists in their profile
  useEffect(() => {
    if (user?.address) {
      setAddress(user.address);
      setIsSaved(true);
      setIsEditing(false);
    }
  }, [user]);

  const handleSaveAddress = () => {
    if (!address.trim() || address.length < 10) {
      return alert("Please enter a complete delivery address (min 10 characters).");
    }
    setIsSaved(true);
    setIsEditing(false);
  };

  const handleChangeAddress = () => {
    setIsEditing(true);
    setIsSaved(false);
  };

  const handleProcessOrder = async () => {
    if (!isSaved) return alert("Please save your delivery address first.");
    setLoading(true);

    const orderData = {
      userId: user.id,
      items: cart,
      paymentMethod: mainMethod,
      deliveryAddress: address,
      totalAmount: totalAmount
    };

    try {
      if (mainMethod === 'COD') {
        await axios.post(`${API_URL}/orders`, orderData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("Order Placed Successfully via COD!");
        clearCart(); onClose();
      } else {
        // Razorpay Online Flow
        const { data: rzpOrder } = await axios.post(`${API_URL}/payment/create-order`, 
          { amount: totalAmount }, 
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: rzpOrder.amount,
          currency: "INR",
          name: "FoodHub",
          description: "Order Payment",
          order_id: rzpOrder.id,
          prefill: { name: user.name, email: user.email, contact: user.phone },
          config: {
            display: {
              blocks: {
                banks: { 
                  name: 'Preferred Method', 
                  instruments: [{ method: onlineSubMethod }] 
                }
              },
              sequence: ['block.banks'],
              preferences: { show_default_blocks: true }
            }
          },
          handler: async (response) => {
            const res = await axios.post(`${API_URL}/orders`, orderData, {
              headers: { Authorization: `Bearer ${token}` }
            });
            await axios.post(`${API_URL}/payment/verify`, {
              ...response, dbOrderId: res.data.orderId, amount: totalAmount
            }, { headers: { Authorization: `Bearer ${token}` } });
            
            alert("Payment Successful! Your food is being prepared.");
            clearCart(); onClose();
          },
          theme: { color: "#ea580c" }
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (err) {
      alert("Error processing your order. Please check your connection.");
    } finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{maxWidth: '550px', maxHeight: '90vh', overflowY: 'auto'}}>
        <button className="btn-close" onClick={onClose}>&times;</button>
        <h2 style={{textAlign:'center', color: '#111827', marginBottom: '15px'}}>Complete Your Order</h2>

        {/* 1. ADDRESS MANAGEMENT SECTION */}
        <div style={{background: '#f8fafc', padding: '15px', borderRadius: '12px', border: '1px solid #e2e8f0'}}>
          <label style={{fontWeight: '700', color: '#334155', display: 'block', marginBottom: '8px'}}>
            Delivery Location
          </label>
          
          {isEditing ? (
            <>
              <textarea 
                placeholder="Enter Flat No, Building Name, Street, and Landmark..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                style={{width:'100%', padding:'12px', borderRadius:'8px', border:'1px solid #cbd5e1', minHeight:'80px', fontSize: '14px'}}
              />
              <button 
                onClick={handleSaveAddress}
                className="btn-add" 
                style={{marginTop: '10px', width: '100%', background: '#16a34a', border: 'none'}}
              >
                Save & Use This Address
              </button>
            </>
          ) : (
            <div style={{padding: '12px', border: '1px dashed #ea580c', borderRadius: '8px', background: '#fff7ed'}}>
              <p style={{fontSize: '0.9rem', color: '#1e293b', lineHeight: '1.5'}}>{address}</p>
              <button 
                onClick={handleChangeAddress}
                style={{marginTop: '8px', color: '#ea580c', background: 'none', border: 'none', fontWeight: '700', cursor: 'pointer', textDecoration: 'underline', fontSize: '13px'}}
              >
                Edit / Change Address
              </button>
            </div>
          )}
        </div>

        {/* 2. ORDER SUMMARY LIST */}
        <div style={{margin: '20px 0', border: '1px solid #f1f5f9', borderRadius: '12px', overflow: 'hidden'}}>
          <div style={{background: '#f1f5f9', padding: '10px 15px', fontWeight: '700', fontSize: '14px'}}>Items in Cart</div>
          <div style={{maxHeight: '150px', overflowY: 'auto', padding: '0 15px'}}>
            {cart.map(item => (
              <div key={item.productId} style={{display:'flex', justifyContent:'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f1f5f9'}}>
                <div>
                    <div style={{fontWeight: '600', fontSize: '14px'}}>{item.name}</div>
                    <div style={{fontSize: '12px', color: '#64748b'}}>₹{item.price} x {item.quantity}</div>
                </div>
                <div style={{fontWeight: '700'}}>₹{item.price * item.quantity}</div>
              </div>
            ))}
          </div>
          <div style={{padding: '12px 15px', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', fontWeight: '800', fontSize: '16px'}}>
            <span>Grand Total</span>
            <span style={{color: '#16a34a'}}>₹{totalAmount}</span>
          </div>
        </div>

        {/* 3. PAYMENT SELECTION */}
        <div style={{opacity: isSaved ? 1 : 0.4, pointerEvents: isSaved ? 'all' : 'none', transition: '0.3s'}}>
          <h3 style={{fontSize: '15px', fontWeight: '700', marginBottom: '10px'}}>Select Payment Method</h3>
          <div className="payment-options">
            <label className="payment-radio">
              <input type="radio" checked={mainMethod === 'COD'} onChange={() => setMainMethod('COD')} />
              <div><strong>Cash on Delivery</strong><p style={{fontSize: '11px', color: '#64748b'}}>Pay when food is delivered</p></div>
            </label>
            
            <label className="payment-radio">
              <input type="radio" checked={mainMethod === 'ONLINE'} onChange={() => setMainMethod('ONLINE')} />
              <div><strong>Online Payment</strong><p style={{fontSize: '11px', color: '#64748b'}}>Securely via Cards, UPI, or Apps</p></div>
            </label>

            {mainMethod === 'ONLINE' && (
              <div style={{marginLeft: '32px', display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px', padding: '10px', borderLeft: '2px solid #ea580c'}}>
                <label style={{fontSize: '13px', display:'flex', alignItems: 'center', gap: '10px', cursor: 'pointer'}}>
                  <input type="radio" checked={onlineSubMethod === 'upi_app'} onChange={() => setOnlineSubMethod('upi_app')} /> 
                  UPI Apps (GPay, PhonePe, Paytm)
                </label>
                <label style={{fontSize: '13px', display:'flex', alignItems: 'center', gap: '10px', cursor: 'pointer'}}>
                  <input type="radio" checked={onlineSubMethod === 'card'} onChange={() => setOnlineSubMethod('card')} /> 
                  Debit / Credit Cards
                </label>
                <label style={{fontSize: '13px', display:'flex', alignItems: 'center', gap: '10px', cursor: 'pointer'}}>
                  <input type="radio" checked={onlineSubMethod === 'upi'} onChange={() => setOnlineSubMethod('upi')} /> 
                  UPI ID (Pay via VPA)
                </label>
              </div>
            )}
          </div>

          <button 
            className="btn-pay" 
            onClick={handleProcessOrder} 
            disabled={loading || cart.length === 0 || !isSaved}
            style={{marginTop: '20px', width: '100%'}}
          >
            {loading ? "Processing..." : mainMethod === 'COD' ? `Place Order • ₹${totalAmount}` : `Pay ₹${totalAmount} Now`}
          </button>
        </div>
        
        {!isSaved && (
          <p style={{textAlign: 'center', fontSize: '12px', color: '#dc2626', marginTop: '10px'}}>
            * Please save your address to enable payment options.
          </p>
        )}
      </div>
    </div>
  );
}

export default CheckoutModal;