const Order = require('../models/Order.js');
const Cart = require('../models/Cart.js');
const sendEmail = require('../utils/sendEmail');
const Counter = require('../models/counterSchema');
const dotenv = require('dotenv');
dotenv.config();

exports.placeOrder = async (req, res) => {
    console.log('Backend received req.body:', req.body);
    try {
        const userId = req.user._id; // Assuming req.user is populated by authentication middleware
        // --- MODIFIED: Extract shippingCost and totalAmount from req.body ---
        const { shippingInfo, paymentMethod, items, shippingCost, totalAmount } = req.body;
        // --- END MODIFIED ---

        let orderItems;

        // This logic correctly determines if it's a Buy Now flow or Cart checkout flow
        if (items && Array.isArray(items) && items.length > 0) {
            // Buy Now flow - use items from request body
            orderItems = items;
        } else {
            // Cart checkout flow - fetch cart from DB
            const cart = await Cart.findOne({ user: userId });
            if (!cart || cart.items.length === 0) {
                return res.status(400).json({ message: 'Cart is empty' });
            }
            orderItems = cart.items;
        }

        // --- REMOVED: Backend recalculation of totalAmount ---
        // const totalAmount = orderItems.reduce((sum, item) => {
        //     return sum + item.discountPrice * item.quantity;
        // }, 0);
        // --- END REMOVED ---

        // Create a new order instance
        const newOrder = new Order({
            user: userId,
            items: orderItems,
            shippingInfo,
            paymentMethod,
            // --- MODIFIED: Use shippingCost and totalAmount from frontend payload ---
            shippingCost: shippingCost, // Use the shippingCost sent from frontend
            totalAmount: totalAmount,  // Use the totalAmount sent from frontend
            // If you still need shippingOption, you might pass it from frontend too,
            // or derive it here (e.g., 'fixed_12_percent_delivery').
            shippingOption: 'fixed_12_percent_delivery', // Example: set a descriptive value
            // --- END MODIFIED ---
        });

        //genrate number order wise
        const lastOrder = await Order.findOne().sort({ orderId: -1 }).select('orderId');
        newOrder.orderId = (lastOrder && lastOrder.orderId ? lastOrder.orderId : 0) + 1;



        // Save the order to the database
        await newOrder.save();

        // Clear cart only if order was created from cart, not from Buy Now
        if (!items || items.length === 0) { // This condition means it was a cart checkout
            await Cart.findOneAndDelete({ user: userId });
        }

        // --- COMMON Order Summary Table HTML (used by both emails) ---
        const orderItemsTableHtml = orderItems.map(item => `
            <tr>
                <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: left; vertical-align: top; font-size: 16px;">
                    <strong>${item.productName}</strong><br />
                    <span style="font-size: 14px; color: #555;">
                        ${item.color ? `Color: ${item.color}` : ''}
                        ${item.color && item.size ? ', ' : ''}
                        ${item.size ? `Size: ${item.size}` : ''}
                    </span>
                </td>
                <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center; vertical-align: top; font-size: 16px;">${item.quantity}</td>
                <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right; vertical-align: top; font-size: 16px;">₹${item.discountPrice.toFixed(2)}</td>
                <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right; vertical-align: top; font-size: 16px;">₹${(item.quantity * item.discountPrice).toFixed(2)}</td>
            </tr>
        `).join('');

        const orderSummaryTableStructure = `
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
                <thead>
                    <tr style="background-color: #f2f2f2;">
                        <th style="padding: 8px; border-bottom: 1px solid #ddd; text-align: left; font-size: 17px;">Item</th>
                        <th style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center; font-size: 17px;">Qty</th>
                        <th style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right; font-size: 17px;">Price</th>
                        <th style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right; font-size: 17px;">Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    ${orderItemsTableHtml}
                    <tr style="background-color: #eaf7ed;">
                        <td colspan="3" style="padding: 8px; text-align: left; font-weight: bold; font-size: 16px;">Subtotal:</td>
                        <td style="padding: 8px; text-align: right; font-weight: bold; font-size: 16px;">₹${(totalAmount - shippingCost).toFixed(2)}</td>
                    </tr>
                    <tr style="background-color: #eaf7ed;">
                        <td colspan="3" style="padding: 8px; text-align: left; font-weight: bold; font-size: 16px;">Delivery Charge:</td>
                        <td style="padding: 8px; text-align: right; font-weight: bold; font-size: 16px;">₹${shippingCost.toFixed(2)}</td>
                    </tr>
                    <tr style="background-color: #eaf7ed;">
                        <td colspan="3" style="padding: 8px; text-align: left; font-weight: bold; font-size: 18px;">Total Amount:</td>
                        <td style="padding: 8px; text-align: right; font-weight: bold; font-size: 18px; color: #4CAF50;">₹${totalAmount.toFixed(2)}</td>
                    </tr>
                </tbody>
            </table>
        `;

        const shippingDetailsHtml = `
            <div style="background-color: #f9f9f9; border-radius: 8px; padding: 20px; font-size: 16px;">
                <p style="margin: 0; font-size: 17px;"><strong>${shippingInfo.fullName}</strong></p>
                <p style="margin: 8px 0; font-size: 16px;">${shippingInfo.streetAddress}${shippingInfo.apartment ? ', ' + shippingInfo.apartment : ''}</p>
                <p style="margin: 8px 0; font-size: 16px;">${shippingInfo.townCity}, ${shippingInfo.state || ''}, ${shippingInfo.zipCode || ''}</p>
                <p style="margin: 8px 0; font-size: 16px;">Phone: ${shippingInfo.phoneNumber}</p>
                <p style="margin: 8px 0 0; font-size: 16px;">Email: ${shippingInfo.emailAddress}</p>
            </div>
        `;

        // --- Customer Email HTML ---
        const customerEmailHtml = `
            <div style="font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.8; color: #333; max-width: 650px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden; background-color: #ffffff; font-size: 17px;">
                <div style="background-color: #4CAF50; color: #ffffff; padding: 25px; text-align: center;">
                    <h1 style="margin: 0; font-size: 32px;">TrendiKala</h1>
                    <p style="margin: 8px 0 0; font-size: 20px;">Order Confirmation</p>
                </div>

                <div style="padding: 25px;">
                    <h2 style="color: #2E7D32; font-size: 26px; margin-top: 0; margin-bottom: 20px;">Hi ${shippingInfo.fullName}, thank you for your order!</h2>
                    <p style="margin-bottom: 25px; font-size: 17px;">Your order <strong style="color: #007bff;"></strong> has been successfully placed with TrendiKala. We're excited for you to receive your items!</p>

                    <div style="background-color: #f9f9f9; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
                        <p style="font-size: 18px; margin-bottom: 8px;"><strong>Order ID:</strong> <span style="color: #007bff;">${newOrder.orderId}</span></p>
                        <p style="font-size: 18px; margin-bottom: 8px;"><strong>Order Date:</strong> ${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        <p style="font-size: 18px; margin-top: 8px;"><strong>Payment Method:</strong> ${paymentMethod}</p>
                    </div>

                    <h3 style="font-size: 20px; color: #333; border-bottom: 1px solid #ddd; padding-bottom: 8px; margin-bottom: 20px;">🧾 Order Summary</h3>
                    ${orderSummaryTableStructure}

                    <h3 style="font-size: 20px; color: #333; border-bottom: 1px solid #ddd; padding-bottom: 8px; margin-bottom: 20px;">📦 Shipping Details</h3>
                    ${shippingDetailsHtml}

                    <p style="margin-top: 35px; text-align: center; font-size: 16px; color: #666;">
                        We’ll send you another email with tracking information once your order has shipped.<br/>
                        For any questions, please contact our support team.
                    </p>
                    
                </div>

                <div style="background-color: #f2f2f2; padding: 20px; text-align: center; font-size: 14px; color: #777; border-top: 1px solid #e0e0e0;">
                    <p style="margin: 0;">&copy; ${new Date().getFullYear()} TrendiKala. All rights reserved.</p>
                    <p style="margin: 8px 0 0;">
                        <a href="[Your Website Link]" style="color: #007bff; text-decoration: none;">Visit Our Store</a> |
                        <a href="[Your Privacy Policy Link]" style="color: #007bff; text-decoration: none;">Privacy Policy</a>
                    </p>
                </div>
            </div>
        `;

        // --- Admin Email HTML ---
        const adminEmailHtml = `
            <div style="font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.8; color: #333; max-width: 650px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden; background-color: #ffffff; font-size: 17px;">
                <div style="background-color: #DC3545; color: #ffffff; padding: 25px; text-align: center;">
                    <h1 style="margin: 0; font-size: 32px;">TrendiKala Admin</h1>
                    <p style="margin: 8px 0 0; font-size: 20px;">New Order Notification</p>
                </div>

                <div style="padding: 25px;">
                    <h2 style="color: #DC3545; font-size: 26px; margin-top: 0; margin-bottom: 20px;">New Order Received!</h2>
                    <p style="margin-bottom: 25px; font-size: 17px;">An new order has been placed by <strong style="color: #007bff;">${shippingInfo.fullName}</strong>.</p>

                    <div style="background-color: #f9f9f9; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
                        <p style="font-size: 18px; margin-bottom: 8px;"><strong>Order ID:</strong> <span style="color: #007bff;">${newOrder.orderId}</span></p>
                        <p style="font-size: 18px; margin-bottom: 8px;"><strong>Order Date:</strong> ${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        <p style="font-size: 18px; margin-top: 8px;"><strong>Payment Method:</strong> ${paymentMethod}</p>
                    </div>

                    <h3 style="font-size: 20px; color: #333; border-bottom: 1px solid #ddd; padding-bottom: 8px; margin-bottom: 20px;">🧾 Order Details</h3>
                    ${orderSummaryTableStructure}

                    <h3 style="font-size: 20px; color: #333; border-bottom: 1px solid #ddd; padding-bottom: 8px; margin-bottom: 20px;">📦 Customer & Shipping Information</h3>
                    ${shippingDetailsHtml}

                    <p style="margin-top: 35px; text-align: center; font-size: 16px; color: #666;">
                        Please process this order promptly.
                    </p>
                    
                </div>

                <div style="background-color: #f2f2f2; padding: 20px; text-align: center; font-size: 14px; color: #777; border-top: 1px solid #e0e0e0;">
                    <p style="margin: 0;">&copy; ${new Date().getFullYear()} TrendiKala Admin. All rights reserved.</p>
                </div>
            </div>
        `;

        // Send email to customer
        await sendEmail(
            shippingInfo.emailAddress,
            `Your TrendiKala Order #${newOrder._id} Confirmed!`,
            customerEmailHtml
        );

        // Send email to admin (fallback if not defined)
        if (process.env.ADMIN_EMAIL) {
            await sendEmail(
                process.env.ADMIN_EMAIL,
                `NEW ORDER: #${newOrder._id} from ${shippingInfo.fullName}`, // More distinct subject
                adminEmailHtml
            );
        }

        res.status(201).json({
            message: 'Order placed successfully and emails sent',
            order: newOrder
        });
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
    console.log('Backend received guest order req.body:', req.body);
    try {
        const { shippingInfo, paymentMethod, items, shippingCost, totalAmount } = req.body;

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
            user: null, // 🚫 no user for guest
            isGuest: true,
            items,
            shippingInfo,
            paymentMethod,
            shippingCost: shippingCost || 0,
            totalAmount,
            shippingOption: 'fixed_12_percent_delivery'
        });

        // Auto-increment orderId
        const lastOrder = await Order.findOne().sort({ orderId: -1 }).select('orderId');
        newOrder.orderId = (lastOrder && lastOrder.orderId ? lastOrder.orderId : 0) + 1;

        await newOrder.save();

        // Build order summary table + shipping HTML (reuse from existing code)
        const orderItemsTableHtml = items.map(item => `
            <tr>
                <td><strong>${item.productName}</strong><br/>
                    <small>${item.color ? `Color: ${item.color}` : ''}${item.color && item.size ? ', ' : ''}${item.size || ''}</small>
                </td>
                <td style="text-align:center;">${item.quantity}</td>
                <td style="text-align:right;">₹${item.discountPrice}</td>
                <td style="text-align:right;">₹${item.quantity * item.discountPrice}</td>
            </tr>
        `).join('');

        const orderSummaryTableStructure = `
            <table style="width:100%;border-collapse:collapse;">
                <thead>
                    <tr>
                        <th style="text-align:left;">Item</th>
                        <th style="text-align:center;">Qty</th>
                        <th style="text-align:right;">Price</th>
                        <th style="text-align:right;">Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    ${orderItemsTableHtml}
                    <tr>
                        <td colspan="3" style="text-align:left;">Subtotal:</td>
                        <td style="text-align:right;">₹${(totalAmount - shippingCost).toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colspan="3" style="text-align:left;">Delivery Charge:</td>
                        <td style="text-align:right;">₹${shippingCost.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colspan="3" style="text-align:left;font-weight:bold;">Total Amount:</td>
                        <td style="text-align:right;font-weight:bold;">₹${totalAmount.toFixed(2)}</td>
                    </tr>
                </tbody>
            </table>
        `;

        const shippingDetailsHtml = `
            <div>
                <p><strong>${shippingInfo.fullName}</strong></p>
                <p>${shippingInfo.streetAddress}${shippingInfo.apartment ? ', ' + shippingInfo.apartment : ''}</p>
                <p>${shippingInfo.townCity}</p>
                <p>Phone: ${shippingInfo.phoneNumber}</p>
                <p>Email: ${shippingInfo.emailAddress}</p>
            </div>
        `;

        const customerEmailHtml = `
            <h2>Thank you for your order at TrendiKala!</h2>
            <p>Order ID: ${newOrder.orderId}</p>
            ${orderSummaryTableStructure}
            <h3>Shipping Details</h3>
            ${shippingDetailsHtml}
        `;

        const adminEmailHtml = `
            <h2>New Guest Order Received</h2>
            <p>Order ID: ${newOrder.orderId}</p>
            ${orderSummaryTableStructure}
            <h3>Shipping Details</h3>
            ${shippingDetailsHtml}
        `;

        await sendEmail(
            shippingInfo.emailAddress,
            `Your TrendiKala Order #${newOrder._id} Confirmed!`,
            customerEmailHtml
        );

        if (process.env.ADMIN_EMAIL) {
            await sendEmail(
                process.env.ADMIN_EMAIL,
                `NEW GUEST ORDER: #${newOrder._id}`,
                adminEmailHtml
            );
        }

        res.status(201).json({
            message: 'Guest order placed successfully and emails sent',
            order: newOrder
        });

    } catch (error) {
        console.error('Guest order error:', error);
        res.status(500).json({ message: 'Failed to place guest order', error: error.message });
    }
};
