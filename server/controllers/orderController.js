const { generateCustomerEmail } = require('../utils/customerEmailTemplate.js');
const { generateAdminEmail } = require('../utils/adminEmailTemplate.js');

const Order = require('../models/Order.js');
const Cart = require('../models/Cart.js');
const sendEmail = require('../utils/sendEmail');
const Counter = require('../models/counterSchema');

const dotenv = require('dotenv');
dotenv.config();

// Place order for  logged-in user
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

        const lastOrder = await Order.findOne().sort({ orderId: -1 }).select('orderId');
        newOrder.orderId = (lastOrder && lastOrder.orderId ? lastOrder.orderId : 0) + 1;

        await newOrder.save();

        if (!items || items.length === 0) {
            await Cart.findOneAndDelete({ user: userId });
        }

        // Generate email HTML using imported functions
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
            await sendEmail(process.env.ADMIN_EMAIL, `NEW ORDER: ${newOrder._id} from ${shippingInfo.fullName}`, adminEmailHtml);
        }

        res.status(201).json({ message: 'Order placed successfully and emails sent', order: newOrder });
    } catch (err) {
        console.error('Order placement error:', err);
        res.status(500).json({ message: 'Failed to place order', error: err.message });
    }
};

// Get all orders for a logged-in user
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
