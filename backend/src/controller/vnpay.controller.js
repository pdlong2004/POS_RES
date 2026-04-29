import Invoice from '../../models/Invoice.js';
import vnpayService from '../services/vnpay.service.js';
import crypto from 'crypto';

function formatDate(date) {
    const pad = (n) => (n < 10 ? '0' + n : n);
    return (
        date.getFullYear() +
        pad(date.getMonth() + 1) +
        pad(date.getDate()) +
        pad(date.getHours()) +
        pad(date.getMinutes()) +
        pad(date.getSeconds())
    );
}

class VnpayController {
    /**
     * Create VNPay Payment URL
     * POST /api/vnpay/create_payment_url
     */
    async createPaymentUrl(req, res) {
        try {
            const { invoiceId, bankCode } = req.body;
            const invoice = await Invoice.findById(invoiceId);

            if (!invoice) {
                return res.status(404).json({ message: 'Không tìm thấy hóa đơn' });
            }

            const tmnCode = process.env.VNP_TMN_CODE;
            const secretKey = process.env.VNP_HASH_SECRET;
            let vnpUrl = process.env.VNP_URL;
            const returnUrl = process.env.VNP_RETURN_URL;

            const date = new Date();
            const createDate = formatDate(date);
            const orderId = formatDate(date).slice(8); // Simplified for sandbox
            
            // Link invoice with TxnRef
            invoice.vnp_TxnRef = orderId;
            await invoice.save();

            const amount = invoice.totalPrice;
            const currCode = 'VND';
            
            let vnp_Params = {};
            vnp_Params['vnp_Version'] = '2.1.0';
            vnp_Params['vnp_Command'] = 'pay';
            vnp_Params['vnp_TmnCode'] = tmnCode;
            vnp_Params['vnp_Locale'] = 'vn';
            vnp_Params['vnp_CurrCode'] = currCode;
            vnp_Params['vnp_TxnRef'] = orderId;
            vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho hoa don ' + invoiceId;
            vnp_Params['vnp_OrderType'] = 'other';
            vnp_Params['vnp_Amount'] = amount * 100;
            vnp_Params['vnp_ReturnUrl'] = returnUrl;
            vnp_Params['vnp_IpAddr'] = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
            vnp_Params['vnp_CreateDate'] = createDate;
            
            if (bankCode !== null && bankCode !== '') {
                vnp_Params['vnp_BankCode'] = bankCode;
            }

            const paymentUrl = vnpayService.buildPaymentUrl(vnp_Params, secretKey, vnpUrl);

            res.status(200).json({ paymentUrl });
        } catch (error) {
            console.error('VNPay Create Error:', error);
            res.status(500).json({ message: 'Lỗi khi tạo link thanh toán' });
        }
    }

    /**
     * VNPay Return URL (Frontend redirect)
     * GET /api/vnpay/vnpay_return
     */
    async vnpayReturn(req, res) {
        try {
            let vnp_Params = req.query;
            const secureHash = vnp_Params['vnp_SecureHash'];

            delete vnp_Params['vnp_SecureHash'];
            delete vnp_Params['vnp_SecureHashType'];

            vnp_Params = vnpayService.sortObject(vnp_Params);

            const secretKey = process.env.VNP_HASH_SECRET;
            const signData = Object.entries(vnp_Params)
                .map(([key, value]) => `${key}=${value}`)
                .join('&');

            const hmac = crypto.createHmac('sha512', secretKey);
            const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

            if (secureHash === signed) {
                const responseCode = vnp_Params['vnp_ResponseCode'];
                const txnRef = vnp_Params['vnp_TxnRef'];
                
                // Update Invoice
                const invoice = await Invoice.findOne({ vnp_TxnRef: txnRef });
                if (invoice) {
                    if (responseCode === '00') {
                        invoice.paymentStatus = 'paid';
                    } else {
                        invoice.paymentStatus = 'cancelled';
                    }
                    invoice.vnp_TransactionNo = vnp_Params['vnp_TransactionNo'];
                    invoice.vnp_BankCode = vnp_Params['vnp_BankCode'];
                    invoice.vnp_PayDate = vnp_Params['vnp_PayDate'];
                    invoice.vnp_ResponseCode = responseCode;
                    await invoice.save();

                    // Redirect to frontend result page
                    return res.redirect(`${process.env.FRONTEND_URL}/payment-result?status=${responseCode === '00' ? 'success' : 'fail'}&invoiceId=${invoice._id}`);
                }
                
                return res.redirect(`${process.env.FRONTEND_URL}/payment-result?status=error`);
            } else {
                return res.redirect(`${process.env.FRONTEND_URL}/payment-result?status=invalid_signature`);
            }
        } catch (error) {
            console.error('VNPay Return Error:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    /**
     * VNPay IPN (Server-to-Server)
     * GET /api/vnpay/vnpay_ipn
     */
    async vnpayIpn(req, res) {
        try {
            let vnp_Params = req.query;
            const secureHash = vnp_Params['vnp_SecureHash'];

            delete vnp_Params['vnp_SecureHash'];
            delete vnp_Params['vnp_SecureHashType'];

            vnp_Params = vnpayService.sortObject(vnp_Params);
            const secretKey = process.env.VNP_HASH_SECRET;
            const signData = Object.entries(vnp_Params)
                .map(([key, value]) => `${key}=${value}`)
                .join('&');

            const hmac = crypto.createHmac('sha512', secretKey);
            const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

            if (secureHash === signed) {
                const responseCode = vnp_Params['vnp_ResponseCode'];
                const txnRef = vnp_Params['vnp_TxnRef'];
                
                const invoice = await Invoice.findOne({ vnp_TxnRef: txnRef });
                
                if (!invoice) {
                    return res.status(200).json({ RspCode: '01', Message: 'Order not found' });
                }

                if (invoice.totalPrice * 100 !== Number(vnp_Params['vnp_Amount'])) {
                    return res.status(200).json({ RspCode: '04', Message: 'Invalid amount' });
                }

                if (invoice.paymentStatus !== 'pending') {
                    return res.status(200).json({ RspCode: '02', Message: 'Order already confirmed' });
                }

                if (responseCode === '00') {
                    invoice.paymentStatus = 'paid';
                } else {
                    invoice.paymentStatus = 'cancelled';
                }

                invoice.vnp_TransactionNo = vnp_Params['vnp_TransactionNo'];
                invoice.vnp_BankCode = vnp_Params['vnp_BankCode'];
                invoice.vnp_PayDate = vnp_Params['vnp_PayDate'];
                invoice.vnp_ResponseCode = responseCode;
                await invoice.save();

                res.status(200).json({ RspCode: '00', Message: 'Success' });
            } else {
                res.status(200).json({ RspCode: '97', Message: 'Invalid Checksum' });
            }
        } catch (error) {
            console.error('VNPay IPN Error:', error);
            res.status(200).json({ RspCode: '99', Message: 'Unknown error' });
        }
    }
}

export default new VnpayController();
