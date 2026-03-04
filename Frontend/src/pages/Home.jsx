import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_URL}/products`);
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [API_URL]);

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '50px' }}>
        <div className="loader">Loading Delicious Food...</div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Hero Section / Banner */}
      <div style={{
        padding: '40px 20px',
        background: 'linear-gradient(to right, #ea580c, #f97316)',
        borderRadius: '20px',
        color: 'white',
        margin: '20px 0',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '10px' }}>
          Craving Something Tasty?
        </h1>
        <p style={{ fontSize: '1.1rem', opacity: '0.9' }}>
          Freshly prepared meals delivered to your doorstep.
        </p>
      </div>

      {/* Menu Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '30px 20px' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#1f2937' }}>
          Explore Our Menu
        </h2>
        <span style={{ color: '#6b7280', fontWeight: '600' }}>
          {products.length} Items Available
        </span>
      </div>

      {/* PRODUCT GRID CONTAINER */}
      {/* This class 'cards-container-grid' connects to your new ProductCard.css */}
      <div className="cards-container-grid">
        {products.length > 0 ? (
          products.map(product => (
            <ProductCard key={product._id} product={product} />
          ))
        ) : (
          <div style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '40px' }}>
            <h3>No products found. Add some from the Admin Panel!</h3>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
