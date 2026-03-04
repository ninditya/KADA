import {
  createSnapTransaction,
  createSnapTransactionRaw,
  getMidtransClientKey,
  getTransactionStatus,
  verifyMidtransSignature
} from '../services/midtransService.js';

// Endpoint sederhana mengikuti contoh Kak Adski (amount, first_name, email).
export async function createTransaction(req, res) {
  try {
    const { amount, first_name, email } = req.body || {};

    if (!amount || !first_name || !email) {
      return res.status(400).json({
        message: 'amount, first_name, dan email wajib diisi (raw JSON)'
      });
    }

    const parameter = {
      transaction_details: {
        order_id: `ORDER-${Date.now()}`,
        gross_amount: amount
      },
      credit_card: {
        secure: true
      },
      customer_details: {
        first_name,
        email
      }
    };

    const transaction = await createSnapTransactionRaw(parameter);

    res.status(200).json({
      message: 'Transaksi berhasil dibuat',
      token: transaction.token,
      redirect_url: transaction.redirect_url
    });
  } catch (error) {
    console.error('Error createTransaction:', error);
    res.status(500).json({ message: 'Gagal membuat transaksi' });
  }
}

// Membuat transaksi Midtrans Snap dan mengembalikan token untuk frontend.
export async function createCheckout(req, res, next) {
  try {
    const amount = Number(req.body.amount);

    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({ result: 'fail', error: 'amount must be a positive number' });
    }

    const orderId = req.body.orderId || `ORDER-${Date.now()}`;
    const itemDetails = Array.isArray(req.body.itemDetails) ? req.body.itemDetails : [];
    const customerDetails = req.body.customerDetails || {};

    const tx = await createSnapTransaction({
      orderId,
      amount,
      itemDetails,
      customerDetails
    });

    res.status(201).json({
      result: 'success',
      orderId,
      token: tx.token,
      redirectUrl: tx.redirect_url,
      clientKey: getMidtransClientKey()
    });
  } catch (error) {
    next(error);
  }
}

// Menerima notifikasi webhook Midtrans untuk update status pembayaran.
export async function handleNotification(req, res, next) {
  try {
    const {
      order_id: orderId,
      status_code: statusCode,
      gross_amount: grossAmount,
      signature_key: signatureKey,
      transaction_status: transactionStatus,
      fraud_status: fraudStatus
    } = req.body;

    const validSignature = verifyMidtransSignature({
      orderId,
      statusCode,
      grossAmount,
      signatureKey
    });

    if (!validSignature) {
      return res.status(401).json({ result: 'fail', error: 'Invalid Midtrans signature' });
    }

    let paymentStatus = 'pending';

    if (transactionStatus === 'capture') {
      paymentStatus = fraudStatus === 'accept' ? 'success' : 'challenge';
    } else if (transactionStatus === 'settlement') {
      paymentStatus = 'success';
    } else if (transactionStatus === 'pending') {
      paymentStatus = 'pending';
    } else if (['deny', 'cancel', 'expire'].includes(transactionStatus)) {
      paymentStatus = 'failed';
    } else if (transactionStatus === 'refund') {
      paymentStatus = 'refunded';
    }

    res.json({
      result: 'success',
      orderId,
      transactionStatus,
      paymentStatus
    });
  } catch (error) {
    next(error);
  }
}

// Mengecek status transaksi berdasarkan orderId.
export async function getStatus(req, res, next) {
  try {
    const status = await getTransactionStatus(req.params.orderId);
    res.json({ result: 'success', status });
  } catch (error) {
    next(error);
  }
}
