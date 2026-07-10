import { Router } from 'express';
import { getDashboardAnalytics } from '../controllers/analyticsController';

const router = Router();

router.get('/:collegeId', getDashboardAnalytics);

export default router;
