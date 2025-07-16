const express = require('express');
const { placeOrder, guestPlaceOrder, getMyOrders } = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/place', authMiddleware, placeOrder);
router.post('/guest-place-order', guestPlaceOrder);
router.get('/my-orders', authMiddleware, getMyOrders);

module.exports = router;
