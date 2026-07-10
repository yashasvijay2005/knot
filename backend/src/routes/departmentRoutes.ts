import { Router } from 'express';
import { createDepartment, getDepartments, deleteDepartment } from '../controllers/departmentController';

const router = Router();

router.post('/', createDepartment);
router.get('/:collegeId', getDepartments);
router.delete('/:id', deleteDepartment);

export default router;
