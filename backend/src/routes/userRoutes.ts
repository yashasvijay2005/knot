import { Router } from 'express';
import { getUsers, updateUserRole, deleteUser } from '../controllers/userController';

const router = Router();

router.get('/:collegeId', getUsers);
router.patch('/:id/role', updateUserRole);
router.delete('/:id', deleteUser);

export default router;
