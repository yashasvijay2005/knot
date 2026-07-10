import { Router } from 'express';
import { getTicket } from '../controllers/ticketController';

const router = Router();

router.get('/:registrationId', getTicket);

export default router;
