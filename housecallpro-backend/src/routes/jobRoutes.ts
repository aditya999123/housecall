// src/routes/jobRoutes.ts

import express from 'express';
import { getJobsForCustomer, createJobForCustomer, getAllJobs } from '../controllers/jobController';

const router = express.Router();

router.get('/customers/:id/jobs', getJobsForCustomer);
router.post('/customers/:id/jobs', createJobForCustomer);
router.get('/jobs', getAllJobs);

export default router;
