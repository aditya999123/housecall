// src/routes/jobRoutes.ts

import express from 'express';
import { getJobsForCustomer, createJobForCustomer } from '../controllers/jobController';

const router = express.Router();

router.get('/customers/:id/jobs', getJobsForCustomer);
router.post('/customers/:id/jobs', createJobForCustomer);

export default router;
