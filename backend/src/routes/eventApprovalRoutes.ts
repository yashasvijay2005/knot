import { Router } from 'express';
import { updateEventStatus, updateEventVisibility } from '../controllers/eventApprovalController';

const router = Router();

router.patch('/:id/status', updateEventStatus);
router.patch('/:id/visibility', updateEventVisibility);

export default router;
