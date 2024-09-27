import express from 'express';
import { checkCustomerExists, createCustomer, createJob } from '../controllers/customerController';

const router = express.Router();

router.post('/customers/exist', checkCustomerExists);
router.post('/customers', createCustomer);
router.post('/jobs', createJob);

export default router;
