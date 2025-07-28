// controllers/productController.js
const Product = require('../models/Product'); // Adjust path as needed
const mongoose = require('mongoose');

// Create a new product
exports.createProduct = async (req, res) => {
    try {
        const {
            productName,
            category,
            brand,
            price,
            discountPrice,
            media: mediaFromBody, // JSON se media URLs
            ...additionalFields
        } = req.body;

        if (!productName) {
            return res.status(400).json({
                success: false,
                message: 'Product name is required',
            });
        }

        let mediaFiles = [];

        if (req.files && req.files.length > 0) {
            // Agar files upload hui hain to unko use karo
            mediaFiles = req.files.map(file => ({
                url: file.path,
                type: file.mimetype.startsWith('video') ? 'video' : 'image',
            }));
        } else if (mediaFromBody && mediaFromBody.length > 0) {
            // Files nahi, par media URLs JSON me mile hain
            mediaFiles = mediaFromBody;
        } else {
            return res.status(400).json({
                success: false,
                message: 'At least one media file or media URL is required',
            });
        }

        const parsedPrice = parseFloat(price);
        const parsedDiscountPrice = parseFloat(discountPrice);

        const thumbnail = mediaFiles.find(file => file.type === 'image')?.url;

        const discountPercent =
            parsedPrice && parsedDiscountPrice
                ? Math.round(((parsedPrice - parsedDiscountPrice) / parsedPrice) * 100)
                : undefined;

        const newProduct = new Product({
            productName,
            category,
            brand,
            price: parsedPrice,
            discountPrice: parsedDiscountPrice,
            discountPercent,
            media: mediaFiles,
            thumbnail,
            ...additionalFields,
        });

        await newProduct.save();

        res.status(201).json({
            success: true,
            data: newProduct,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create product',
            error: error.message,
        });
    }
};


// Get all products with optional filtering
exports.getAllProducts = async (req, res) => {
    try {
        const query = {};

        // Filter by category if provided (category id expected)
        if (req.query.category) {
            query.category = req.query.category;
        }

        // Filter by brand
        if (req.query.brand) {
            query.brand = req.query.brand;
        }

        // Filter by price range
        if (req.query.minPrice || req.query.maxPrice) {
            query.price = {};
            if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
            if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
        }

        // Find products with category populated (only required fields)
        const products = await Product.find(query)
            .populate('category', 'name slug icon')  // Populate category name, slug, icon
            .exec();

        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch products',
            error: error.message
        });
    }
};

// Get single product by ID
exports.getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            return res.status(400).json({
                success: false,
                message: 'Invalid product ID format'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Failed to fetch product',
            error: error.message
        });
    }
};

// Update product by ID
exports.updateProduct = async (req, res) => {
    try {
        const updates = Object.keys(req.body);
        const allowedUpdates = [
            'productName', 'category', 'brand', 'media', 'thumbnail',
            'price', 'discountPrice', 'discountPercent', 'description',
            'detailedDescription', 'colors', 'sizes', 'details',
            'materialWashing', 'sizeShape'
        ];
        const isValidOperation = updates.every(update => allowedUpdates.includes(update));

        if (!isValidOperation) {
            return res.status(400).json({
                success: false,
                message: 'Invalid updates!'
            });
        }

        // Recalculate discountPercent if price or discountPrice is updated
        if (updates.includes('price') || updates.includes('discountPrice')) {
            if (req.body.price && req.body.discountPrice) {
                req.body.discountPercent = Math.round(((req.body.price - req.body.discountPrice) / req.body.price) * 100);
            } else {
                req.body.discountPercent = null;
            }
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            return res.status(400).json({
                success: false,
                message: 'Validation Error',
                errors: error.errors
            });
        }
        res.status(500).json({
            success: false,
            message: 'Failed to update product',
            error: error.message
        });
    }
};

// Delete product by ID
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete product',
            error: error.message
        });
    }
};

// Get product statistics (count by category, average price, etc.)
exports.getProductStats = async (req, res) => {
    try {
        const stats = await Product.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 },
                    avgPrice: { $avg: '$price' },
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' }
                }
            },
            {
                $sort: { avgPrice: -1 }
            }
        ]);

        res.status(200).json({
            success: true,
            count: stats.length,
            data: stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch product statistics',
            error: error.message
        });
    }
};



// controllers/productController.js

exports.addProductReview = async (req, res) => {
    try {
        const productId = req.params.id;
        const { rating, comment } = req.body;

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        const review = {
            user: req.user._id,       // Pass user ObjectId from protect middleware
            name: req.user.name,      // User's name
            rating,
            comment,
            verified: true,
            date: new Date().toISOString().split('T')[0], // e.g. "2025-07-03"
        };

        product.reviews.push(review);
        await product.save();

        res.status(201).json({ message: 'Review added successfully', review });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to add review', error: err.message });
    }
};




// Search products by name, category, description, brand, and tags (partial, case-insensitive match)
exports.searchProducts = async (req, res) => {
    try {
        const query = req.query.query?.trim();

        if (!query) {
            return res.status(400).json({
                success: false,
                message: 'Search query is required',
            });
        }

        const products = await Product.find({
            $or: [
                { productName: { $regex: query, $options: 'i' } },
                { category: { $regex: query, $options: 'i' } },
                // { description: { $regex: query, $options: 'i' } },
                // { brand: { $regex: query, $options: 'i' } },
                // { tags: { $elemMatch: { $regex: query, $options: 'i' } } }, 
            ],
        });

        res.status(200).json({
            success: true,
            count: products.length,
            data: products,
        });
    } catch (error) {
        console.error('Search Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to search products',
            error: error.message,
        });
    }
};

