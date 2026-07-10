import { Router } from 'express';
import { checkIn } from '../controllers/attendanceController';

const router = Router();

router.post('/checkin', checkIn);

export default router;
