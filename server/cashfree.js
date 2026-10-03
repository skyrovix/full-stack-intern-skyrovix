import crypto from 'crypto';

/**
 * Cashfree Payments Service
 * Handles Order Creation, Status Verification, and Webhook Signature Validation.
 * Secret keys are strictly kept server-side and never exposed to client.
 */

export const getCashfreeBaseUrl = () => {
  const env = (process.env.CASHFREE_ENVIRONMENT || 'sandbox').toLowerCase();
  return env === 'production'
    ? 'https://api.cashfree.com/pg'
    : 'https://sandbox.cashfree.com/pg';
};

export const isCashfreeConfigured = () => {
  const clientId = process.env.CASHFREE_CLIENT_ID;
  const clientSecret = process.env.CASHFREE_CLIENT_SECRET;
  return Boolean(
    clientId &&
    clientSecret &&
    clientId !== 'your_client_id' &&
    clientId !== 'your_cashfree_client_id' &&
    clientSecret !== 'your_client_secret' &&
    clientSecret !== 'your_cashfree_client_secret'
  );
};

export const getCashfreeHeaders = () => {
  return {
    'Content-Type': 'application/json',
    'x-client-id': process.env.CASHFREE_CLIENT_ID || '',
    'x-client-secret': process.env.CASHFREE_CLIENT_SECRET || '',
    'x-api-version': process.env.CASHFREE_API_VERSION || '2023-08-01',
  };
};

/**
 * Generate a unique Cashfree order ID following the required pattern
 * Example: SKY-B1-1727341234-A7BC
 */
export const generateOrderId = () => {
  const timestamp = Date.now();
  const randomHex = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `SKY-B1-${timestamp}-${randomHex}`;
};

/**
 * Create a new Cashfree PG Order (Server-Side)
 */
export async function createCashfreeOrder({
  orderId,
  amount = 200.0,
  student,
  returnUrl,
  notifyUrl,
}) {
  const configured = isCashfreeConfigured();

  if (!configured) {
    console.log(`ℹ️ Cashfree credentials in simulation/sandbox mode for Order ID: ${orderId}`);
    // Generate a secure mock session ID for sandbox demo environment
    const testSessionId = `session_sandbox_demo_${crypto.randomBytes(16).toString('hex')}`;
    return {
      success: true,
      mode: 'sandbox_simulation',
      order_id: orderId,
      order_amount: amount,
      order_currency: 'INR',
      payment_session_id: testSessionId,
      order_status: 'ACTIVE',
      message: 'Running in Cashfree Sandbox Developer Mode. Ready for live merchant credentials in .env'
    };
  }

  const endpoint = `${getCashfreeBaseUrl()}/orders`;
  const sanitizedPhone = String(student.mobile || '9999999999').replace(/[^0-9]/g, '').slice(-10);

  let finalReturnUrl = returnUrl || `${process.env.APP_URL || 'http://localhost:5173'}/payment/status?order_id={order_id}`;
  if ((process.env.CASHFREE_ENVIRONMENT || '').toLowerCase() === 'production' && finalReturnUrl.startsWith('http://')) {
    finalReturnUrl = finalReturnUrl.replace(/^http:\/\//, 'https://');
  }

  let finalNotifyUrl = notifyUrl || `${process.env.SERVER_URL || 'http://localhost:5000'}/api/payments/cashfree/webhook`;
  if ((process.env.CASHFREE_ENVIRONMENT || '').toLowerCase() === 'production' && finalNotifyUrl.startsWith('http://')) {
    finalNotifyUrl = finalNotifyUrl.replace(/^http:\/\//, 'https://');
  }

  const payload = {
    order_id: orderId,
    order_amount: Number(amount).toFixed(2),
    order_currency: 'INR',
    order_note: 'Skyrovix Batch 1 Internship Registration Fee',
    customer_details: {
      customer_id: `cust_${student.id}`,
      customer_name: student.full_name,
      customer_email: student.email,
      customer_phone: sanitizedPhone || '9876543210',
    },
    order_meta: {
      return_url: finalReturnUrl,
      notify_url: finalNotifyUrl,
      payment_methods: 'cc,dc,upi,nb,app',
    },
  };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: getCashfreeHeaders(),
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Cashfree Order Creation API Error:', data);
      throw new Error(data.message || 'Cashfree payment gateway order creation failed');
    }

    return {
      success: true,
      mode: process.env.CASHFREE_ENVIRONMENT || 'sandbox',
      order_id: data.order_id,
      payment_session_id: data.payment_session_id,
      order_status: data.order_status,
      cf_order_id: data.cf_order_id,
      data,
    };
  } catch (error) {
    console.error('❌ Cashfree Network / API Error:', error.message);
    throw error;
  }
}

/**
 * Fetch and Verify Order Status from Cashfree Servers
 * Strictly server-side to prevent client parameter spoofing
 */
export async function verifyCashfreePayment(orderId) {
  const configured = isCashfreeConfigured();

  if (!configured) {
    // In sandbox simulation mode, orders remain PENDING unless verified by an explicit test action or real gateway
    return {
      verified: true,
      isSimulation: true,
      order_id: orderId,
      order_status: 'ACTIVE',
      payment_status: 'PENDING',
      is_paid: false,
      cashfree_payment_id: null,
      payment_method: null,
      amount: 200.0,
      currency: 'INR',
      message: 'Payment has not been completed. Real Cashfree credentials can be configured in server/.env.'
    };
  }

  try {
    const orderEndpoint = `${getCashfreeBaseUrl()}/orders/${encodeURIComponent(orderId)}`;
    const paymentsEndpoint = `${getCashfreeBaseUrl()}/orders/${encodeURIComponent(orderId)}/payments`;

    const [orderRes, paymentsRes] = await Promise.all([
      fetch(orderEndpoint, { headers: getCashfreeHeaders() }),
      fetch(paymentsEndpoint, { headers: getCashfreeHeaders() }),
    ]);

    const orderData = await orderRes.json();
    let paymentsData = [];
    try {
      paymentsData = await paymentsRes.json();
    } catch {
      paymentsData = [];
    }

    if (!orderRes.ok) {
      console.error(`❌ Order fetch failed for ${orderId}:`, orderData);
      return {
        verified: false,
        order_status: 'NOT_FOUND',
        message: orderData.message || 'Order not found on Cashfree',
      };
    }

    // Check if any payment attempt was SUCCESSFUL
    const successfulPayment = Array.isArray(paymentsData)
      ? paymentsData.find((p) => p.payment_status === 'SUCCESS')
      : null;

    const isPaid = orderData.order_status === 'PAID' || Boolean(successfulPayment);

    let paymentStatus = 'PENDING';
    if (isPaid) {
      paymentStatus = 'SUCCESS';
    } else if (orderData.order_status === 'EXPIRED' || orderData.order_status === 'TERMINATED') {
      paymentStatus = 'FAILED';
    } else if (Array.isArray(paymentsData) && paymentsData.some(p => p.payment_status === 'FAILED')) {
      paymentStatus = 'FAILED';
    } else if (Array.isArray(paymentsData) && paymentsData.some(p => p.payment_status === 'USER_DROPPED')) {
      paymentStatus = 'USER_DROPPED';
    }

    return {
      verified: true,
      isSimulation: false,
      order_id: orderId,
      order_status: orderData.order_status,
      payment_status: paymentStatus,
      is_paid: isPaid,
      amount: orderData.order_amount,
      currency: orderData.order_currency,
      cashfree_payment_id: successfulPayment?.cf_payment_id || null,
      payment_method: successfulPayment?.payment_method
        ? (typeof successfulPayment.payment_method === 'object' ? Object.keys(successfulPayment.payment_method)[0] : successfulPayment.payment_method)
        : 'Cashfree PG',
      raw_order: orderData,
      raw_payments: paymentsData,
    };
  } catch (error) {
    console.error(`❌ Error verifying Cashfree payment for ${orderId}:`, error.message);
    throw error;
  }
}

/**
 * Verify Cashfree Webhook Signature
 * Formula: HMAC_SHA256(timestamp + rawBody, client_secret)
 */
export function verifyCashfreeWebhookSignature({
  rawBody,
  timestamp,
  signature,
}) {
  const secret = process.env.CASHFREE_CLIENT_SECRET || process.env.CASHFREE_WEBHOOK_SECRET;
  if (!secret) {
    console.warn('⚠️ Webhook secret not configured. Skipping signature verification in sandbox.');
    return true;
  }

  if (!timestamp || !signature) {
    return false;
  }

  try {
    const dataToSign = `${timestamp}${rawBody}`;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(dataToSign)
      .digest('base64');

    const expectedBuffer = Buffer.from(expectedSignature, 'utf-8');
    const receivedBuffer = Buffer.from(signature, 'utf-8');

    if (expectedBuffer.length !== receivedBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
  } catch (err) {
    console.error('❌ Webhook signature computation error:', err.message);
    return false;
  }
}
