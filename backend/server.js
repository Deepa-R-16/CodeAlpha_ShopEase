const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

app.use(cors({ origin: '*', methods: ['GET','POST','PUT','DELETE'], allowedHeaders: ['Content-Type','Authorization'] }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ MongoDB Error:', err.message));

app.use('/api/auth',     require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders',   require('./routes/orderRoutes'));

const frontend = path.join(__dirname, '../frontend');

app.get('/',              (req, res) => res.sendFile(path.join(frontend, 'index.html')));
app.get('/index.html',    (req, res) => res.sendFile(path.join(frontend, 'index.html')));
app.get('/cart.html',     (req, res) => res.sendFile(path.join(frontend, 'cart.html')));
app.get('/product.html',  (req, res) => res.sendFile(path.join(frontend, 'product.html')));
app.get('/login.html',    (req, res) => res.sendFile(path.join(frontend, 'login.html')));
app.get('/register.html', (req, res) => res.sendFile(path.join(frontend, 'register.html')));
app.get('/orders.html',   (req, res) => res.sendFile(path.join(frontend, 'orders.html')));

app.use('/css',    express.static(path.join(frontend, 'css')));
app.use('/js',     express.static(path.join(frontend, 'js')));
app.use('/images', express.static(path.join(frontend, 'images')));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('🚀 Server running on http://localhost:' + PORT));