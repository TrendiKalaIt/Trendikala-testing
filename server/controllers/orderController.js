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

        const orderItemsTableHtml = orderItems.map(item => `
            <tr>
                <td style="padding: 10px; border: 1px solid #ddd; text-align: left; font-size: 14px;">
                    <strong>${item.productName}</strong><br />
                    <span style="color: #666; font-size: 13px;">${item.domainName || ''}</span> </td>
                <td style="padding: 10px; border: 1px solid #ddd; text-align: center; font-size: 14px;">${item.quantity} ${item.unit || 'Unit'}</td>
                 <td style="padding: 10px; border: 1px solid #ddd; text-align: right; font-size: 14px;">₹${item.discountPrice.toFixed(2)}</td>
            </tr>
        `).join('');

        const orderSummaryTableStructure = ` <table style="width: 100%; border-collapse: collapse; margin-top: 20px; font-family: Arial, sans-serif; border: 1px solid #ddd;">
    <thead>
      <tr>
        <th style="padding: 10px; border: 1px solid #ddd; text-align: left; background-color: #f8f8f8; font-size: 14px; color: #555;">Product</th>
        <th style="padding: 10px; border: 1px solid #ddd; text-align: center; background-color: #f8f8f8; font-size: 14px; color: #555;">Quantity</th>
        <th style="padding: 10px; border: 1px solid #ddd; text-align: right; background-color: #f8f8f8; font-size: 14px; color: #555;">Price</th>
      </tr>
    </thead>
    <tbody>
      ${orderItemsTableHtml}
     <tr>
  <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold; font-size: 14px; border: 1px solid #ddd;">Subtotal:</td>
  <td style="padding: 10px; text-align: right; font-size: 14px; border: 1px solid #ddd;">₹${(totalAmount - shippingCost).toFixed(2)}</td>
</tr>
<tr>
  <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold; font-size: 14px; border: 1px solid #ddd;">Shipping:</td>
  <td style="padding: 10px; text-align: right; font-size: 14px; border: 1px solid #ddd;">₹${shippingCost.toFixed(2)}</td>
</tr>

    </tbody>
  </table>
`;


        // Shipping details are not visible in the provided image's design for the main email body.
        // I'll keep a minimal version for admin email or if you want to add it to customer email later.
        const shippingDetailsHtml = `
            <div style="font-family: Arial, sans-serif; font-size: 14px; color: #333;">
                <p style="margin: 0;"><strong>${shippingInfo.fullName}</strong></p>
                <p style="margin: 5px 0 0;">${shippingInfo.streetAddress}${shippingInfo.apartment ? ', ' + shippingInfo.apartment : ''}</p>
                <p style="margin: 5px 0 0;">${shippingInfo.townCity}, ${shippingInfo.state || ''}, ${shippingInfo.zipCode || ''}</p>
                <p style="margin: 5px 0 0;">Phone: ${shippingInfo.phoneNumber}</p>
                <p style="margin: 5px 0 0;">Email: ${shippingInfo.emailAddress}</p>
            </div>
        `;


        // --- Customer Email HTML - Matching the image design ---
        const customerEmailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; background-color: #ffffff;">
                <div style="background-color: #5bbd72; padding: 15px 30px; text-align: start; color: #ffffff;">
                    <h1 style="margin: 0; font-size: 28px; font-weight: bold;">Thanks for your order, ${shippingInfo.fullName.split(' ')[0]}.</h1>
                    <p style="font-size: 16px; margin-top: 15px; line-height: 1.5;">Here's your confirmation for order number <span style="font-weight: bold;">${newOrder.orderId}</span>. Review your receipt and get started using your products.</p>
                </div>

                <div style="padding: 30px;">
                    <h2 style="font-size: 18px; margin-top: 0; margin-bottom: 20px; color: #333;">Order Number: <span style="font-weight: normal; color: #000;">${newOrder.orderId}</span></h2>
                    ${orderSummaryTableStructure}
                    
                    <div style="text-align: right; margin-top: 10px; padding-top: 10px; border-top: 1px solid #eee; font-size: 15px; font-weight: bold;">
                        Total: ₹${(totalAmount + shippingCost).toFixed(2)}
                    </div>
                    </div>

                <div style="padding: 20px 30px; text-align: center; font-size: 12px; color: #999;">
                    &copy; ${new Date().getFullYear()} Trendikala.
                </div>
            </div>
        `;

        // --- Admin Email HTML - You can decide if you want to use the same new design or a simpler one ---
        // For admin, a simpler, more direct format might be preferred.
        // I will keep a version similar to your original admin email for clarity,
        // but adjusted for consistency with table structure.
        const adminEmailHtml = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #f0f0f0;  overflow: hidden;">
                <div style="background-color: #5bbd72; padding: 20px; text-align: center; border-bottom: 1px solid #e0e0e0;">
                    <h2 style="color: #333; margin: 0;">New Order Notification - ${newOrder.orderId}</h2>
                </div>
                <div style="padding: 20px;">
                    <p>Dear Admin,</p>
                    <p>A new order has been placed on your store.</p>
                    
                    <h3>Order Details:</h3>
                    <p><strong>Order ID:</strong> ${newOrder.orderId}</p>
                    <p><strong>Order Date:</strong> ${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <p><strong>Payment Method:</strong> ${paymentMethod}</p>

                    ${orderSummaryTableStructure}

                    <p style="font-weight: bold;text-align: right;">Total Paid: ₹${totalAmount.toFixed(2)}</p>

                    <h3>Customer & Shipping Information:</h3>
                    ${shippingDetailsHtml}

                    <p style="margin-top: 20px;">Please log in to the admin panel to process this order.</p>
                </div>
                <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #777; border-top: 1px solid #e0e0e0;">
                    &copy; ${new Date().getFullYear()} Trendikala Admin.
                </div>
            </div>
        `;





        // Send email to customer
        await sendEmail(
            shippingInfo.emailAddress,
            `Your TrendiKala Order ${newOrder.orderId} Confirmed!`,
            customerEmailHtml
        );

        // Send email to admin (fallback if not defined)
        if (process.env.ADMIN_EMAIL) {
            await sendEmail(
                process.env.ADMIN_EMAIL,
                `NEW ORDER: ${newOrder._id} from ${shippingInfo.fullName}`,
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
            user: null, //  no user for guest
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
        <td style="padding: 10px; border: 1px solid #ddd; text-align: left; font-size: 14px;">
            <strong>${item.productName}</strong><br />
            <span style="color: #666; font-size: 13px;">${item.domainName || ''}</span>
        </td>
        <td style="padding: 10px; border: 1px solid #ddd; text-align: center; font-size: 14px;">${item.quantity} ${item.unit || 'Unit'}</td>
        <td style="padding: 10px; border: 1px solid #ddd; text-align: right; font-size: 14px;">₹${item.discountPrice.toFixed(2)}</td>
    </tr>
`).join('');

        const orderSummaryTableStructure = `
    <table style="width: 100%; border-collapse: collapse; margin-top: 20px; font-family: Arial, sans-serif; border: 1px solid #ddd;">
        <thead>
            <tr>
                <th style="padding: 10px; border: 1px solid #ddd; text-align: left; background-color: #f8f8f8; font-size: 14px; color: #555;">Product</th>
                <th style="padding: 10px; border: 1px solid #ddd; text-align: center; background-color: #f8f8f8; font-size: 14px; color: #555;">Quantity</th>
                <th style="padding: 10px; border: 1px solid #ddd; text-align: right; background-color: #f8f8f8; font-size: 14px; color: #555;">Price</th>
            </tr>
        </thead>
        <tbody>
            ${orderItemsTableHtml}
              <tr>
  <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold; font-size: 14px; border: 1px solid #ddd;">Subtotal:</td>
  <td style="padding: 10px; text-align: right; font-size: 14px; border: 1px solid #ddd;">₹${(totalAmount - shippingCost).toFixed(2)}</td>
</tr>
<tr>
  <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold; font-size: 14px; border: 1px solid #ddd;">Shipping:</td>
  <td style="padding: 10px; text-align: right; font-size: 14px; border: 1px solid #ddd;">₹${shippingCost.toFixed(2)}</td>
</tr>
        </tbody>
    </table>
`;

        const shippingDetailsHtml = `
    <div style="font-family: Arial, sans-serif; font-size: 14px; color: #333;">
        <p style="margin: 0;"><strong>${shippingInfo.fullName}</strong></p>
        <p style="margin: 5px 0 0;">${shippingInfo.streetAddress}${shippingInfo.apartment ? ', ' + shippingInfo.apartment : ''}</p>
        <p style="margin: 5px 0 0;">${shippingInfo.townCity}, ${shippingInfo.state || ''}, ${shippingInfo.zipCode || ''}</p>
        <p style="margin: 5px 0 0;">Phone: ${shippingInfo.phoneNumber}</p>
        <p style="margin: 5px 0 0;">Email: ${shippingInfo.emailAddress}</p>
    </div>
`;

        const customerEmailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; background-color: #ffffff;">
        <div style="background-color: #5bbd72; padding: 15px 30px; text-align: start; color: #ffffff;">
            <h1 style="margin: 0; font-size: 28px; font-weight: bold;">Thanks for your order, ${shippingInfo.fullName.split(' ')[0]}.</h1>
            <p style="font-size: 16px; margin-top: 15px; line-height: 1.5;">Here's your confirmation for order number <span style="font-weight: bold;">${newOrder.orderId}</span>. Review your receipt and get started using your products.</p>
        </div>

        <div style="padding: 30px;">
            <h2 style="font-size: 18px; margin-top: 0; margin-bottom: 20px; color: #333;">Order Number: <span style="font-weight: normal; color: #000;">${newOrder.orderId}</span></h2>
            ${orderSummaryTableStructure}

            <div style="text-align: right; margin-top: 10px; padding-top: 10px; border-top: 1px solid #eee; font-size: 15px; font-weight: bold;">
                Total: ₹${(totalAmount + shippingCost).toFixed(2)}
            </div>
        </div>

        <div style="padding: 20px 30px; text-align: center; font-size: 12px; color: #999;">
            &copy; ${new Date().getFullYear()} Trendikala.
        </div>
    </div>
`;

        const adminEmailHtml = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #f0f0f0;  overflow: hidden;">
        <div style="background-color: #f5f5f5; padding: 20px; text-align: center; border-bottom: 1px solid #e0e0e0;">
            <h2 style="color: #333; margin: 0;">New Guest Order Notification - ${newOrder.orderId}</h2>
        </div>
        <div style="padding: 20px;">
            <p>Dear Admin,</p>
            <p>A new guest order has been placed on your store.</p>

            <h3>Order Details:</h3>
            <p><strong>Order ID:</strong> ${newOrder.orderId}</p>
            <p><strong>Order Date:</strong> ${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p><strong>Payment Method:</strong> ${paymentMethod}</p>

            ${orderSummaryTableStructure}

            <p style="font-weight: bold; text-align: right;">Total Paid: ₹${totalAmount.toFixed(2)}</p>

            <h3>Customer & Shipping Information:</h3>
            ${shippingDetailsHtml}

            <p style="margin-top: 20px;">Please log in to the admin panel to process this order.</p>
        </div>
        <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #777; border-top: 1px solid #e0e0e0;">
            &copy; ${new Date().getFullYear()} Trendikala Admin.
        </div>
    </div>
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


