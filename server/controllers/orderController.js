const { generateCustomerEmail } = require('../utils/customerEmailTemplate.js');
const { generateAdminEmail } = require('../utils/adminEmailTemplate.js');

const Order = require('../models/Order.js');
const Cart = require('../models/Cart.js');
const sendEmail = require('../utils/sendEmail');
const Counter = require('../models/counterSchema');
const Product = require('../models/Product.js');


const dotenv = require('dotenv');
dotenv.config();


exports.placeOrder = async (req, res) => {
    try {
        const userId = req.user._id;
        const { shippingInfo, paymentMethod, items, shippingCost, totalAmount } = req.body;

        let orderItems;
        if (items && Array.isArray(items) && items.length > 0) {
            orderItems = items;
        } else {
            const cart = await Cart.findOne({ user: userId });
            if (!cart || cart.items.length === 0) {
                return res.status(400).json({ message: 'Cart is empty' });
            }
            orderItems = cart.items;
        }

        //  Validate stock before placing the order
        for (const item of orderItems) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(400).json({ message: 'Product not found' });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    message: `Product "${product.productName}" is out of stock or has only ${product.stock} left.`,
                });
            }
        }

        // Create new order
        const newOrder = new Order({
            user: userId,
            items: orderItems,
            shippingInfo,
            paymentMethod,
            shippingCost,
            totalAmount,
            shippingOption: 'fixed_12_percent_delivery',
            paymentStatus: paymentMethod === 'Razorpay' ? 'Paid' : 'Pending',
        });

        // Generate orderId
        const lastOrder = await Order.findOne().sort({ orderId: -1 }).select('orderId');
        newOrder.orderId = (lastOrder && lastOrder.orderId ? lastOrder.orderId : 0) + 1;

        await newOrder.save();

        // Update stock for each product in the order
        for (const item of orderItems) {
            // Assuming item.product holds the product ID, and item.quantity holds quantity ordered
            const product = await Product.findById(item.product);
            if (!product) continue;

            // Decrease stock but don't go below 0
            product.stock = Math.max(product.stock - item.quantity, 0);

            await product.save();
        }

        // Clear cart if items were taken from cart
        if (!items || items.length === 0) {
            await Cart.findOneAndDelete({ user: userId });
        }

        // Generate emails
        const customerEmailHtml = generateCustomerEmail(
            newOrder,
            shippingInfo,
            orderItems,
            paymentMethod,
            Number(totalAmount),
            Number(shippingCost)
        );
        const adminEmailHtml = generateAdminEmail(newOrder, shippingInfo, orderItems, paymentMethod, totalAmount, shippingCost);

        // Send emails
        await sendEmail(shippingInfo.emailAddress, `Your TrendiKala Order ${newOrder.orderId} Confirmed!`, customerEmailHtml);
        if (process.env.ADMIN_EMAIL) {
            await sendEmail(process.env.ADMIN_EMAIL, `NEW ORDER: ${newOrder.orderId} from ${shippingInfo.fullName}`, adminEmailHtml);
        }

        res.status(201).json({ message: 'Order placed successfully and emails sent', order: newOrder });
    } catch (err) {
        console.error('Order placement error:', err);
        res.status(500).json({ message: 'Failed to place order', error: err.message });
    }
};

exports.getMyOrders = async (req, res) => {
    try {
        const userId = req.user._id;

        const orders = await Order.find({ user: userId })
            .sort({ createdAt: -1 }) // most recent first
            .lean();

        res.status(200).json({ orders });
    } catch (err) {
        console.error('Failed to fetch user orders:', err);
        res.status(500).json({ message: 'Failed to get orders', error: err.message });
    }
};

// guest order place 
exports.guestPlaceOrder = async (req, res) => {
    try {
        const { shippingInfo, paymentMethod, items, shippingCost = 0, totalAmount } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: 'Order items are required' });
        }

        if (
            !shippingInfo?.fullName ||
            !shippingInfo?.streetAddress ||
            !shippingInfo?.townCity ||
            !shippingInfo?.phoneNumber ||
            !shippingInfo?.emailAddress
        ) {
            return res.status(400).json({ message: 'Complete shipping info is required' });
        }

        const newOrder = new Order({
            user: null,
            isGuest: true,
            items,
            shippingInfo,
            paymentMethod,
            shippingCost,
            totalAmount,
            shippingOption: 'fixed_12_percent_delivery',
            paymentStatus: paymentMethod === 'Razorpay' ? 'Paid' : 'Pending',
        });

        const lastOrder = await Order.findOne().sort({ orderId: -1 }).select('orderId');
        newOrder.orderId = (lastOrder && lastOrder.orderId ? lastOrder.orderId : 0) + 1;

        await newOrder.save();

        const customerEmailHtml = generateCustomerEmail(
            newOrder,
            shippingInfo,
            items,
            paymentMethod,
            Number(totalAmount),
            Number(shippingCost)
        );

        const adminEmailHtml = generateAdminEmail(newOrder, shippingInfo, items, paymentMethod, totalAmount, shippingCost);

        await sendEmail(shippingInfo.emailAddress, `Your TrendiKala Order #${newOrder.orderId} Confirmed!`, customerEmailHtml);

        if (process.env.ADMIN_EMAIL) {
            await sendEmail(process.env.ADMIN_EMAIL, `NEW GUEST ORDER: #${newOrder.orderId}`, adminEmailHtml);
        }

        res.status(201).json({
            message: 'Guest order placed successfully and emails sent',
            order: newOrder,
        });
    } catch (error) {
        console.error('Guest order error:', error);
        res.status(500).json({ message: 'Failed to place guest order', error: error.message });
    }
};

//GET TOTAL REVENUE
exports.getTotalRevenue = async (req, res) => {
    try {
        const result = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$totalAmount" }
                }
            }
        ]);

        const totalRevenue = result[0]?.totalRevenue || 0;
        res.status(200).json({ totalRevenue });
    } catch (error) {
        console.error("Error calculating total revenue:", error);
        res.status(500).json({ message: "Server error" });
    }
};


//GET TOTAL CUSTOMERS
exports.getTotalCustomers = async (req, res) => {
    try {
        const uniqueUsers = await Order.distinct('user', { user: { $ne: null } });
        const totalCustomers = uniqueUsers.length;
        res.status(200).json({ totalCustomers });
    } catch (error) {
        console.error("Error fetching total customers:", error);
        res.status(500).json({ message: "Server error" });
    }
};
