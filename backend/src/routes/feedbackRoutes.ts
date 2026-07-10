import { Router } from 'express';
import { submitFeedback, getEventFeedback, getEventSummary } from '../controllers/feedbackController';

const router = Router();

router.post('/', submitFeedback);
router.get('/event/:eventId', getEventFeedback);
router.get('/event/:eventId/summary', getEventSummary);

export default router;
