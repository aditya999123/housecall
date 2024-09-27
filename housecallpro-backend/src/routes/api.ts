import express from 'express';
import { checkCustomerExists, getCustomerById } from '../controllers/customerController';

const router = express.Router();

router.post('/customers/exist', checkCustomerExists);
router.get('/customers/:id', getCustomerById);
// router.post('/customers', createCustomer);
// router.post('/jobs', createJob);

export default router;
