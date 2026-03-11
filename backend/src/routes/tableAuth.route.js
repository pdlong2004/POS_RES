import express from 'express';
import { loginByQRCode } from '../controller/tableAuth.controller.js';

const router = express.Router();

router.post('/login-qr', loginByQRCode);

export default router;
