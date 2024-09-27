import express from 'express';
import { checkCustomerExists, getCustomerById, createCustomerController } from '../controllers/customerController';

const router = express.Router();

router.post('/customers/exist', checkCustomerExists);
router.get('/customers/:id', getCustomerById);
router.post('/customers', createCustomerController);

// router.post('/jobs', createJob);

export default router;
