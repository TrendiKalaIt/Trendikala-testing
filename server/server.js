// const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const connectDb = require('./config/db');
const { connectCloudinary } = require('./config/cloudinary');

// Route imports (CommonJS)
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const addressRoutes = require('./routes/addressRoutes');
const contactRoutes = require('./routes/contactRoutes');

// Initialize Express
const app = express();

// Setup CORS with whitelist from environment variable
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map(origin => origin.trim())
  : [];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy: This origin is not allowed'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

// Enable CORS with these options
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); 

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB
connectDb();

// Connect to Cloudinary
connectCloudinary();

// Mount API Routes
app.use('/api/auth', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/contact', contactRoutes);

// Test POST route
app.post('/test', (req, res) => {
  res.send('POST request received');
});

// Root route
app.get('/', (req, res) => {
  res.send('API is working hello');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
