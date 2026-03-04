const Product = require('../models/Product');
const fs = require('fs');
const path = require('path');

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ msg: 'Not found' });
    res.json(product);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const imageUrl = req.file ? `http://localhost:5000/uploads/${req.file.filename}` : req.body.imageUrl;
    const product = await Product.create({ name, description, price, category, imageUrl });
    res.status(201).json(product);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    // Delete local image file if it exists
    if (product.imageUrl && product.imageUrl.includes('/uploads/')) {
      const fileName = product.imageUrl.split('/').pop();
      const filePath = path.join(__dirname, '../uploads/', fileName);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Product deleted" });
  } catch (err) { res.status(500).json({ error: "Delete failed" }); }
};