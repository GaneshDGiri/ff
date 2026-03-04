import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminDashboard() {
  // Tabs: orders, inventory, customers, payments
  const [activeTab, setActiveTab] = useState('orders'); 
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Data States
  const [data, setData] = useState({ orders: [], customers: [], totalRevenue: 0 });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form States
  const [formData, setFormData] = useState({ name: '', price: '', category: 'Main Course', description: '' });
  const [imageFile, setImageFile] = useState(null);
  
  const token = localStorage.getItem('token');
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetchAdminData();
    fetchProducts();
  }, []);

  const fetchAdminData = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(res.data);
    } catch (err) {
      console.error("Access Denied or API Error");
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/products`);
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to load menu");
    }
  };

  const handleStatusUpdate = async (orderId, status) => {
    try {
      await axios.put(`${API_URL}/admin/update-status`, 
        { orderId, status }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAdminData(); // Refresh list
    } catch (err) {
      alert("Status update failed");
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to remove this item from the menu?")) {
      try {
        await axios.delete(`${API_URL}/products/${productId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("Product removed.");
        fetchProducts(); // Refresh inventory
      } catch (err) {
        alert("Failed to delete product.");
      }
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const uploadData = new FormData();
    uploadData.append('name', formData.name);
    uploadData.append('price', formData.price);
    uploadData.append('category', formData.category);
    uploadData.append('description', formData.description);
    if (imageFile) uploadData.append('image', imageFile);

    try {
      await axios.post(`${API_URL}/products`, uploadData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}` 
        }
      });
      alert("Dish published successfully!");
      setShowAddForm(false);
      fetchProducts();
    } catch (err) {
      alert("Failed to upload product");
    }
  };

  if (loading) return <div className="container"><h2>Loading Owner Dashboard...</h2></div>;

  return (
    <div className="container">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', margin:'20px 0'}}>
        <h1>Owner Control Panel</h1>
        <button className="btn-cart" onClick={() => window.location.href='/'}>View Shop</button>
      </div>
      
      {/* Navigation Tabs */}
      <div style={{display:'flex', gap:'10px', marginBottom:'20px', overflowX:'auto', paddingBottom:'10px'}}>
        <button className={`btn-add ${activeTab === 'orders' ? '' : 'btn-inactive'}`} onClick={() => setActiveTab('orders')}>Live Orders</button>
        <button className={`btn-add ${activeTab === 'inventory' ? '' : 'btn-inactive'}`} onClick={() => setActiveTab('inventory')}>Manage Menu</button>
        <button className={`btn-add ${activeTab === 'customers' ? '' : 'btn-inactive'}`} onClick={() => setActiveTab('customers')}>User Database</button>
        <button className={`btn-add ${activeTab === 'payments' ? '' : 'btn-inactive'}`} onClick={() => setActiveTab('payments')}>Payment Logs</button>
      </div>

      <div className="card" style={{padding: '20px'}}>

        {/* 1. ORDERS TAB */}
        {activeTab === 'orders' && (
          <div>
            <h3>Recent Orders</h3>
            <div style={{overflowX: 'auto', marginTop:'15px'}}>
              <table style={{width: '100%', borderCollapse: 'collapse'}}>
                <thead>
                  <tr style={{background: '#f9fafb', textAlign: 'left'}}>
                    <th style={{padding:'12px'}}>Customer</th>
                    <th style={{padding:'12px'}}>Items</th>
                    <th style={{padding:'12px'}}>Total</th>
                    <th style={{padding:'12px'}}>Status</th>
                    <th style={{padding:'12px'}}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data.orders.map(order => (
                    <tr key={order._id} style={{borderBottom: '1px solid #eee'}}>
                      <td style={{padding:'12px'}}><strong>{order.user?.name}</strong><br/><small>{order.user?.phone}</small></td>
                      <td style={{padding:'12px'}}>{order.items.length} items</td>
                      <td style={{padding:'12px', fontWeight:'bold'}}>₹{order.totalAmount}</td>
                      <td style={{padding:'12px'}}><span style={{color:'#ea580c', fontWeight:'bold'}}>{order.orderStatus}</span></td>
                      <td style={{padding:'12px'}}>
                        <select onChange={(e) => handleStatusUpdate(order._id, e.target.value)} style={{padding:'5px'}}>
                          <option value="">Set Status</option>
                          <option value="Preparing">Preparing</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 2. INVENTORY TAB (Manage Menu with Remove Feature) */}
        {activeTab === 'inventory' && (
          <div>
            <div style={{display:'flex', justifyContent:'space-between', marginBottom:'20px'}}>
              <h3>Current Menu ({products.length})</h3>
              <button className="btn-add" style={{width:'auto'}} onClick={() => setShowAddForm(!showAddForm)}>
                {showAddForm ? "Close Form" : "+ Add New Dish"}
              </button>
            </div>

            {showAddForm && (
              <form onSubmit={handleAddProduct} className="auth-container" style={{margin:'0 0 30px 0', maxWidth:'100%', border:'2px solid #ea580c'}}>
                <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:'15px'}}>
                  <div className="form-group"><label>Dish Name</label><input type="text" required onChange={e => setFormData({...formData, name: e.target.value})} /></div>
                  <div className="form-group"><label>Price (₹)</label><input type="number" required onChange={e => setFormData({...formData, price: e.target.value})} /></div>
                  <div className="form-group">
                    <label>Category</label>
                    <select style={{width:'100%', padding:'10px'}} onChange={e => setFormData({...formData, category: e.target.value})}>
                      <option value="Main Course">Main Course</option>
                      <option value="Starters">Starters</option>
                      <option value="Beverages">Beverages</option>
                      <option value="Desserts">Desserts</option>
                    </select>
                  </div>
                  <div className="form-group"><label>Image File</label><input type="file" accept="image/*" required onChange={e => setImageFile(e.target.files[0])} /></div>
                </div>
                <div className="form-group"><label>Description</label><textarea style={{width:'100%', height:'60px'}} onChange={e => setFormData({...formData, description: e.target.value})}></textarea></div>
                <button type="submit" className="btn-add">Add to Menu</button>
              </form>
            )}

            <div className="product-grid" style={{gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))'}}>
               {products.map(p => (
                 <div key={p._id} className="card" style={{padding:'10px', position:'relative'}}>
                    {/* DELETE BUTTON */}
                    <button 
                      onClick={() => handleDeleteProduct(p._id)}
                      style={{position:'absolute', top:'5px', right:'5px', background:'#dc2626', color:'white', border:'none', borderRadius:'50%', width:'25px', height:'25px', cursor:'pointer', zIndex:'10'}}
                    >
                      &times;
                    </button>
                    <img src={p.imageUrl} style={{width:'100%', height:'120px', objectFit:'cover', borderRadius:'8px'}} alt="" />
                    <h4 style={{marginTop:'10px'}}>{p.name}</h4>
                    <p style={{color:'#16a34a', fontWeight:'bold'}}>₹{p.price}</p>
                 </div>
               ))}
            </div>
          </div>
        )}

        {/* 3. USER DATABASE TAB */}
        {activeTab === 'customers' && (
          <div>
            <h3>All Registered Users ({data.customers.length})</h3>
            <div style={{overflowX: 'auto', marginTop: '15px'}}>
              <table style={{width: '100%', borderCollapse: 'collapse'}}>
                <thead style={{background:'#f9fafb'}}>
                  <tr>
                    <th style={{padding:'12px', textAlign:'left'}}>Name</th>
                    <th style={{padding:'12px', textAlign:'left'}}>Contact</th>
                    <th style={{padding:'12px', textAlign:'left'}}>Role</th>
                    <th style={{padding:'12px', textAlign:'left'}}>Joined Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data.customers.map(user => (
                    <tr key={user._id} style={{borderBottom:'1px solid #eee'}}>
                      <td style={{padding:'12px', fontWeight:'bold'}}>{user.name}</td>
                      <td style={{padding:'12px'}}>{user.email}<br/><small>{user.phone}</small></td>
                      <td style={{padding:'12px'}}><span className="secure-tag" style={{background:'#e0f2fe', color:'#0369a1', padding:'3px 8px'}}>{user.role}</span></td>
                      <td style={{padding:'12px'}}>{new Date(user.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. PAYMENT LOGS TAB */}
        {activeTab === 'payments' && (
          <div>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
              <h3>Finance Tracker</h3>
              <div style={{background: '#16a34a', color: 'white', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold'}}>
                Total Revenue: ₹{data.totalRevenue}
              </div>
            </div>
            <div style={{overflowX: 'auto'}}>
              <table style={{width: '100%', borderCollapse: 'collapse'}}>
                <thead style={{background:'#f9fafb'}}>
                  <tr>
                    <th style={{padding:'12px', textAlign:'left'}}>Method</th>
                    <th style={{padding:'12px', textAlign:'left'}}>Amount</th>
                    <th style={{padding:'12px', textAlign:'left'}}>Status</th>
                    <th style={{padding:'12px', textAlign:'left'}}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data.orders.map(order => (
                    <tr key={order._id} style={{borderBottom:'1px solid #eee'}}>
                      <td style={{padding:'12px'}}>
                        <span style={{
                          padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold',
                          background: order.paymentMethod === 'ONLINE' ? '#fef3c7' : '#dcfce7',
                          color: order.paymentMethod === 'ONLINE' ? '#92400e' : '#166534'
                        }}>{order.paymentMethod}</span>
                      </td>
                      <td style={{padding:'12px', fontWeight:'bold'}}>₹{order.totalAmount}</td>
                      <td style={{padding:'12px', color: order.paymentStatus === 'Completed' ? '#16a34a' : '#dc2626'}}>● {order.paymentStatus}</td>
                      <td style={{padding:'12px'}}>{new Date(order.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;