const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/auth');

// POST /api/products/:id/seed — Seed sample products
router.get('/seed/all', async (req, res) => {
  try {
    await Product.deleteMany({});
    const sampleProducts = [
      { name: 'Wireless Headphones Pro', description: 'Premium noise-cancelling wireless headphones with 30hr battery life and Hi-Fi sound quality.', price: 2999, category: 'Electronics', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', stock: 50, rating: 4.5, numReviews: 12 },
      { name: 'Smart Watch Series X', description: 'Feature-packed smartwatch with health monitoring, GPS, and 7-day battery life.', price: 8999, category: 'Electronics', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', stock: 30, rating: 4.2, numReviews: 8 },
      { name: 'Running Shoes Ultra', description: 'Lightweight and breathable running shoes with advanced cushioning technology.', price: 3499, category: 'Sports', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', stock: 100, rating: 4.7, numReviews: 25 },
      { name: 'Cotton Classic T-Shirt', description: '100% premium cotton t-shirt, comfortable fit, available in multiple colors.', price: 599, category: 'Clothing', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', stock: 200, rating: 4.0, numReviews: 45 },
      { name: 'JavaScript: The Good Parts', description: 'Essential JavaScript programming guide by Douglas Crockford. A must-read for developers.', price: 499, category: 'Books', image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400', stock: 75, rating: 4.8, numReviews: 60 },
      { name: 'Portable Bluetooth Speaker', description: 'Waterproof portable speaker with 360° sound, 20hr playtime and deep bass.', price: 1999, category: 'Electronics', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400', stock: 40, rating: 4.3, numReviews: 18 },
      { name: 'Yoga Mat Premium', description: 'Eco-friendly non-slip yoga mat, 6mm thick for ultimate comfort during workouts.', price: 899, category: 'Sports', image: 'https://images.unsplash.com/photo-1599447421416-3414500d18a5?w=400', stock: 60, rating: 4.6, numReviews: 30 },
      { name: 'Ceramic Coffee Mug Set', description: 'Set of 4 handcrafted ceramic mugs, microwave and dishwasher safe, 350ml each.', price: 799, category: 'Home', image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400', stock: 85, rating: 4.4, numReviews: 22 },
    ];
    const products = await Product.insertMany(sampleProducts);
    res.json({ message: `${products.length} products seeded successfully!`, products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// GET /api/products — Get all products (with search & filter)
router.get('/', async (req, res) => {
  try {
    const { keyword, category, minPrice, maxPrice, page = 1, limit = 8 } = req.query;

    let query = {};
    if (keyword) query.name = { $regex: keyword, $options: 'i' };
    if (category) query.category = category;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const count = await Product.countDocuments(query);
    const products = await Product.find(query)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort({ createdAt: -1 });

    res.json({
      products,
      page: Number(page),
      pages: Math.ceil(count / limit),
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/products/:id — Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/products — Create product (admin only)
router.post('/', protect, admin, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/products/:id — Update product (admin only)
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true
    });
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/products/:id — Delete product (admin only)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (product) {
      res.json({ message: 'Product deleted' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;