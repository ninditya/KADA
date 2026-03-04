import crypto from 'node:crypto';
import midtransClient from 'midtrans-client';

//configurasi Midtrans menggunakan variabel lingkungan (Kak Adzki tutorial)
function getMidtransConfig() {
  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  const clientKey = process.env.MIDTRANS_CLIENT_KEY;
  const isProduction = process.env.MIDTRANS_IS_PRODUCTION === 'true';

  if (!serverKey || !clientKey) {
    throw new Error('MIDTRANS_SERVER_KEY and MIDTRANS_CLIENT_KEY are required');
  }

  return { serverKey, clientKey, isProduction };
}

// Membuat instance Snap untuk transaksi pembayaran. (Kak Adzki tutorial)
function getSnap() {
  return new midtransClient.Snap(getMidtransConfig());
}

// Membuat instance CoreApi untuk operasi transaksi lainnya. (Kak Adzki tutorial)
function getCoreApi() {
  return new midtransClient.CoreApi(getMidtransConfig());
}

export function getMidtransClientKey() {
  return process.env.MIDTRANS_CLIENT_KEY || null;
}

// Membuat transaksi Snap dan mengembalikan token pembayaran.
export async function createSnapTransaction({ orderId, amount, itemDetails = [], customerDetails = {} }) {
  const snap = getSnap();

  const payload = {
    transaction_details: {
      order_id: orderId,
      gross_amount: amount
    },
    item_details: itemDetails,
    customer_details: customerDetails
  };

  return snap.createTransaction(payload);
}

// Membuat transaksi Snap dari payload mentah (raw) sesuai kebutuhan custom endpoint.
export async function createSnapTransactionRaw(payload) {
  const snap = getSnap();
  return snap.createTransaction(payload);
}

// Memverifikasi signature notifikasi webhook dari Midtrans.
export function verifyMidtransSignature({ orderId, statusCode, grossAmount, signatureKey }) {
  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  if (!serverKey) return false;

  const raw = `${orderId}${statusCode}${grossAmount}${serverKey}`;
  const expected = crypto.createHash('sha512').update(raw).digest('hex');

  return expected === signatureKey;
}

// Mengambil status transaksi terbaru dari Midtrans.
export async function getTransactionStatus(orderId) {
  const coreApi = getCoreApi();
  return coreApi.transaction.status(orderId);
}
