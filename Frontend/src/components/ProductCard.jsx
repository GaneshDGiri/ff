import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import './ProductCard.css'; // <--- IMPORTANT: Link the new file here

function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);

  return (
    <div className="product-card-item">
      <Link to={`/product/${product._id}`} className="product-card-image-wrapper">
        <img src={product.imageUrl} className="product-card-img" alt={product.name} />
      </Link>
      
      <div className="product-card-body">
        <div>
          <h3 className="product-card-title">{product.name}</h3>
          <p className="product-card-desc">{product.description}</p>
        </div>
        
        <div className="product-card-footer">
          <span className="product-card-price">₹{product.price}</span>
          <button 
            onClick={() => addToCart(product, 1)} 
            className="product-card-btn"
          >
            Quick Add
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;