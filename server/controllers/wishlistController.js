const mongoose = require('mongoose');
const Wishlist = require('../models/Wishlist');

// Add product to wishlist
exports.addProduct = async (req, res) => {
    // req.user._id will now be correctly populated by authMiddleware
    // The || req.body.userId is a good fallback for local testing without a token
    const userId = req.user?._id || req.body.userId;

    const { productId } = req.body;

    // Validate inputs
    if (!userId) {
        // This validation should ideally not be hit if authMiddleware is working
        return res.status(401).json({ success: false, message: 'User ID is required' });
    }

    if (!productId) {
        return res.status(400).json({ success: false, message: 'Product ID is required' });
    }

    // Basic ObjectId validation for productId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ success: false, message: 'Invalid Product ID format' });
    }

    try {
        let wishlist = await Wishlist.findOne({ user: userId });

        if (!wishlist) {
            // Create new wishlist if none exists for the user
            wishlist = new Wishlist({
                user: userId, // This will now correctly receive a valid userId
                products: [{ product: productId }],
            });
        } else {
            // Check if product already exists in the wishlist
            const exists = wishlist.products.some(
                (p) => p.product.toString() === productId
            );

            if (exists) {
                return res.status(400).json({
                    success: false,
                    message: 'Product already in wishlist',
                });
            }

            // Add new product to existing wishlist
            wishlist.products.push({ product: productId });
        }

        // Save the updated/new wishlist
        await wishlist.save();

        res.status(201).json({
            success: true,
            message: 'Product added to wishlist',
            data: wishlist,
        });
    } catch (error) {
        // Catch Mongoose validation errors or other server errors
        console.error("Error in addProduct:", error); // Log the full error for debugging
        if (error.name === 'ValidationError') {
            return res.status(400).json({ success: false, message: error.message });
        }
        res.status(500).json({
            success: false,
            message: 'Server Error: ' + error.message,
        });
    }
};

// Remove product from wishlist
exports.removeProduct = async (req, res) => {
    // Assumes req.user._id is populated by authMiddleware
    const userId = req.user._id;
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ success: false, message: 'Invalid productId' });
    }

    try {
        const wishlist = await Wishlist.findOne({ user: userId });

        if (!wishlist) {
            return res.status(404).json({ success: false, message: 'Wishlist not found' });
        }

        const initialLength = wishlist.products.length;
        wishlist.products = wishlist.products.filter(p => p.product.toString() !== productId);

        if (wishlist.products.length === initialLength) {
            return res.status(404).json({ success: false, message: 'Product not found in wishlist' });
        }

        await wishlist.save();

        // Return updated wishlist with populated product details
        // Note: .populate() must be called on a Mongoose document instance or a query
        // If you want populated data after save, you might need to re-fetch or populate before returning
        const updatedWishlist = await Wishlist.findOne({ user: userId }).populate('products.product');

        res.json({ success: true, message: 'Product removed from wishlist', data: updatedWishlist });
    } catch (error) {
        console.error("Error in removeProduct:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all wishlist products for user
exports.getWishlist = async (req, res) => {
    // Assumes req.user._id is populated by authMiddleware
    const userId = req.user._id;

    try {
        const wishlist = await Wishlist.findOne({ user: userId }).populate('products.product').lean();

        // Return empty array if wishlist doesn't exist yet
        if (!wishlist) {
            return res.json({ success: true, data: [] });
        }

        res.json({ success: true, data: wishlist.products });
    } catch (error) {
        console.error("Error in getWishlist:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Check if a product is in wishlist
// exports.checkProduct = async (req, res) => {
//     // Assumes req.user._id is populated by authMiddleware
//     const userId = req.user._id;
//     const { productId } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(productId)) {
//         return res.status(400).json({ success: false, message: 'Invalid productId' });
//     }

//     try {
//         const wishlist = await Wishlist.findOne({ user: userId });

//         if (!wishlist) {
//             return res.json({ success: true, isWishlisted: false });
//         }

//         const isWishlisted = wishlist.products.some(p => p.product.toString() === productId);

//         res.json({ success: true, isWishlisted });
//     } catch (error) {
//         console.error("Error in checkProduct:", error);
//         res.status(500).json({ success: false, message: error.message });
//     }
// };

// Clear entire wishlist
// exports.clearWishlist = async (req, res) => {
//     // Assumes req.user._id is populated by authMiddleware
//     const userId = req.user._id;

//     try {
//         const wishlist = await Wishlist.findOne({ user: userId });

//         if (!wishlist) {
//             return res.status(404).json({ success: false, message: 'Wishlist not found' });
//         }

//         wishlist.products = []; // Set products array to empty
//         await wishlist.save();

//         res.json({ success: true, message: 'Wishlist cleared' });
//     } catch (error) {
//         console.error("Error in clearWishlist:", error);
//         res.status(500).json({ success: false, message: error.message });
//     }
// };