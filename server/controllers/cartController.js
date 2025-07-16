// controllers/cartController.js
const mongoose = require('mongoose');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.getUserCart = async (req, res) => {
  try {
    // Get cart for logged-in user with product details
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart) return res.status(200).json({ items: [] });  // Return empty if no cart
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching cart', error: err.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const user = req.user._id;
    const { items, shippingOption } = req.body;

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ message: "Invalid request format: items must be an array" });
    }

    // Find or create user's cart
    let cart = await Cart.findOne({ user }) || new Cart({ user, items: [] });

    for (const incomingItem of items) {
      const { product: productId, quantity, color, size } = incomingItem;

      // Check that product exists
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${productId}` });
      }

      // Try to find existing item by _id first
      let existingItem = incomingItem._id ? cart.items.id(incomingItem._id) : null;

      // Fallback to find by product + color + size
      if (!existingItem) {
        existingItem = cart.items.find(i =>
          i.product.equals(product._id) &&
          i.color === color &&
          i.size === size
        );
      }

      if (existingItem) {
        // Update existing item
        existingItem.quantity = quantity;
        existingItem.discountPrice = product.discountPrice;
        existingItem.productName = product.productName;
        existingItem.image = product.thumbnail || '';
        existingItem.color = color;
        existingItem.size = size;
      } else {
        // Add new item to cart
        cart.items.push({
          _id: new mongoose.Types.ObjectId(),
          product: product._id,
          quantity,
          discountPrice: product.discountPrice,
          productName: product.productName,
          image: product.thumbnail || '',
          color,
          size
        });
      }
    }

    // Set or update shipping option
    cart.shippingOption = shippingOption || cart.shippingOption || 'free';
    cart.updatedAt = Date.now();

    await cart.save();

    res.status(200).json({ message: 'Cart updated successfully', cart });

  } catch (err) {
    res.status(500).json({ message: 'Error updating cart', error: err.message });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity, color, size } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    // Find item in cart by ID
    let item = cart.items.id(itemId);
    if (!item) {
      item = cart.items.find(i => i._id && i._id.toString() === itemId);
    }

    if (!item) return res.status(404).json({ message: 'Item not found in cart' });

    // Update item fields
    item.quantity = quantity;
    if (color) item.color = color;
    if (size) item.size = size;

    await cart.save();

    res.status(200).json({ message: 'Cart item updated', cart });
  } catch (err) {
    res.status(500).json({ message: 'Error updating cart item', error: err.message });
  }
};


exports.removeCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    if (!itemId) return res.status(400).json({ message: 'ItemId param missing' });

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    // Remove item from cart items array
    cart.items = cart.items.filter(item => item && item._id && item._id.toString() !== itemId);

    await cart.save();

    res.status(200).json({ message: 'Item removed', cart });
  } catch (err) {
    res.status(500).json({ message: 'Error removing item', error: err.message });
  }
};

exports.clearCart = async (req, res) => {
  try {
    // Delete entire cart for user
    const cart = await Cart.findOneAndDelete({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found or already empty' });

    res.status(200).json({ message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ message: 'Error clearing cart', error: err.message });
  }
};
