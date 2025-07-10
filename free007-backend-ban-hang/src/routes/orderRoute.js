import * as Order from '../controllers/order.js';
import * as OrderValidator from '../Schema/order.schema.js';

import express from 'express';

const router = express.Router();

// ------------------- order --------------------------
router.get('/GetDetailOrder', Order.GetDetailOrder);
router.get('/GetAllOrder', Order.GetAllOrder);
router.get('/orders', Order.getAll);
router.post('/orders', OrderValidator.validation, Order.createOrder);
router.put('/orders/:id', Order.updateStatus);
router.get('/orders/:id', Order.getOrderById);

//
router.get('/deleteOrder', Order.deleteOrder);
router.get('/updateOrder', Order.updateOrder);

export default router;
