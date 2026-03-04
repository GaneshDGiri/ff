import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => console.error(err));
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    alert(`${quantity} ${product.name}(s) added to cart!`);
    navigate('/'); 
  };

  if (!product) return <div className="text-center mt-20 text-xl">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden mt-10 flex flex-col md:flex-row">
      <img src={product.imageUrl} alt={product.name} className="w-full md:w-1/2 h-64 md:h-auto object-cover" />
      
      <div className="p-8 md:w-1/2 flex flex-col justify-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
        <p className="text-gray-500 mb-6 uppercase tracking-wide text-sm">{product.category}</p>
        <p className="text-gray-700 text-lg mb-6">{product.description}</p>
        <div className="text-3xl font-bold text-green-600 mb-6">₹{product.price}</div>
        
        <div className="flex items-center gap-4 mb-6">
          <label className="font-semibold text-gray-700">Quantity:</label>
          <input 
            type="number" 
            min="1" 
            value={quantity} 
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-20 border-2 border-gray-300 p-2 rounded text-center"
          />
        </div>

        <button 
          onClick={handleAddToCart}
          className="w-full bg-orange-500 text-white py-3 rounded-lg font-bold text-lg hover:bg-orange-600 transition"
        >
          Add to Cart - ₹{product.price * quantity}
        </button>
      </div>
    </div>
  );
}

export default ProductDetail;