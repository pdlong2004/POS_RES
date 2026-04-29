import crypto from 'crypto';

/**
 * Utility service for VNPay logic
 */
class VnpayService {
    /**
     * Sort object keys alphabetically
     * @param {Object} obj 
     * @returns {Object}
     */
    sortObject(obj) {
        let sorted = {};
        let str = [];
        let key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                str.push(encodeURIComponent(key));
            }
        }
        str.sort();
        for (key = 0; key < str.length; key++) {
            sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
        }
        return sorted;
    }

    /**
     * Generate Hashed Signature (HMAC-SHA512)
     * @param {string} secret 
     * @param {string} data 
     * @returns {string}
     */
    generateSignature(secret, data) {
        const hmac = crypto.createHmac('sha512', secret);
        return hmac.update(Buffer.from(data, 'utf-8')).digest('hex');
    }

    /**
     * Build Payment URL
     * @param {Object} params 
     * @param {string} secretKey 
     * @param {string} baseUrl 
     * @returns {string}
     */
    buildPaymentUrl(params, secretKey, baseUrl) {
        const sortedParams = this.sortObject(params);
        const signData = Object.entries(sortedParams)
            .map(([key, value]) => `${key}=${value}`)
            .join('&');
        
        const hmac = crypto.createHmac('sha512', secretKey);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
        
        const finalUrl = new URL(baseUrl);
        Object.entries(sortedParams).forEach(([key, value]) => {
            finalUrl.searchParams.append(key, value);
        });
        finalUrl.searchParams.append('vnp_SecureHash', signed);

        return finalUrl.toString();
    }
}

export default new VnpayService();
