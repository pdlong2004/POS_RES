import express from 'express';
import { loginAccount } from '../controller/auth.controller.js';

const router = express.Router();

router.post('/login', loginAccount);

export default router;
