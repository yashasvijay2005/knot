import { Router } from 'express';
import { getCampusMap } from '../controllers/campusMapController';

const router = Router();

router.get('/:collegeId', getCampusMap);

export default router;
