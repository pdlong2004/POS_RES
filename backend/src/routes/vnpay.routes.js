import express from 'express';
import vnpayController from '../controller/vnpay.controller.js';

const router = express.Router();

router.post('/create_payment_url', vnpayController.createPaymentUrl);
router.get('/vnpay_return', vnpayController.vnpayReturn);
router.get('/vnpay_ipn', vnpayController.vnpayIpn);

export default router;
