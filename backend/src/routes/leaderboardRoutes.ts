import { Router } from 'express';
import { submitScore, getLeaderboard } from '../controllers/leaderboardController';

const router = Router();

router.post('/score', submitScore);
router.get('/:eventId', getLeaderboard);

export default router;
