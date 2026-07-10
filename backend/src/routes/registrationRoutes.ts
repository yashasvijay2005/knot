import { Router } from 'express';
import { registerIndividual, registerTeam, getUserRegistrations } from '../controllers/registrationController';

const router = Router();

router.post('/individual', registerIndividual);
router.post('/team', registerTeam);
router.get('/user/:userId', getUserRegistrations);

export default router;
