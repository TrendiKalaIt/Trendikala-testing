const mongoose = require('mongoose');
const moment = require('moment');
const Product = require('./Product')
const Counter = require('./counterSchema')

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  productName: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  discountPrice: { type: Number, required: true },
  image: { type: String },
  color: { type: String },
  size: { type: String }
}, { _id: false });

const shippingInfoSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  streetAddress: { type: String, required: true },
  apartment: { type: String },
  townCity: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  emailAddress: { type: String, required: true }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true,
    index: true
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  items: [orderItemSchema],
  shippingInfo: shippingInfoSchema,
  paymentMethod: { type: String, enum: ['bank', 'cashOnDelivery', 'Razorpay'], default: 'cashOnDelivery', required: true },
  shippingCost: {
    type: Number,
    required: true,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed'],
    default: 'Pending'
  },
  orderStatus: {
    type: String,
    enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  createdAt: { type: Date, default: Date.now },
  isGuest: { type: Boolean, default: false }
});

orderSchema.pre('save', async function (next) {
  if (!this.isNew) return next();  // Only generate orderId for new orders

  if (!this.items.length) {
    return next(new Error("Order must have at least one item"));
  }

  const firstProduct = await Product.findById(this.items[0].product).populate('category');
  if (!firstProduct) {
    return next(new Error("Product not found for order"));
  }

  const dateStr = moment().format('MMDD');  // Get the current date in MMDD format
  const productCode = firstProduct.productCode;  // Fetch the product code dynamically

  // Fetch and update the global counter
  let counter = await Counter.findOneAndUpdate(
    { id: 'globalOrderSeq' },  // Use a global counter id
    { $inc: { seq: 1 } },  // Increment the sequence number by 1
    { new: true, upsert: true }  // Create the counter if it doesn't exist
  );

  if (!counter) {
    return next(new Error("Failed to update counter sequence."));
  }

  const seqNumber = String(counter.seq).padStart(4, '0');  // Ensure sequence is 4 digits

  // Construct the final orderId: MMDD-productCode-sequence
  this.orderId = `${dateStr}-${productCode}-${seqNumber}`;

  next();
});


const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
