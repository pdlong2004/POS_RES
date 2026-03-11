import express from 'express';
import {
    createInvoice,
    getInvoices,
    getInvoiceById,
    updateInvoice,
    payInvoice,
    closeInvoiceForTable,
    getRevenue,
    getAllInvoices,
} from '../controller/invoice.controller.js';

const router = express.Router();

router.post('/', createInvoice);
router.get('/', getInvoices);
router.get('/all', getAllInvoices);
router.get('/revenue', getRevenue);
router.get('/:id', getInvoiceById);
router.put('/:id', updateInvoice);
router.put('/:id/pay', payInvoice);
router.post('/close', closeInvoiceForTable);

export default router;
