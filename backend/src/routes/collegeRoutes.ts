import { Router } from 'express';
import { createCollege, getColleges } from '../controllers/collegeController';

const router = Router();

router.post('/', createCollege);
router.get('/', getColleges);

export default router;
