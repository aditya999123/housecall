import express from 'express';
import { getJobsForCustomer } from '../controllers/jobController';

const router = express.Router();

router.get('/customers/:id/jobs', getJobsForCustomer);

export default router;
