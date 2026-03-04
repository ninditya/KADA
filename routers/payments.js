import { Router } from 'express';
import { createTransaction, createCheckout, handleNotification, getStatus } from '../controllers/paymentsController.js';

const router = Router();

router.post('/transaction', createTransaction); // (Kak Adzki's example endpoint)

// router.post('/checkout', createCheckout);
// router.post('/notification', handleNotification);
// router.get('/:orderId/status', getStatus);

export default router;
