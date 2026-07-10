import { Router } from 'express';
import { getUserNotifications, markAsRead, createNotification } from '../controllers/notificationController';

const router = Router();

router.get('/user/:userId', getUserNotifications);
router.patch('/:id/read', markAsRead);
router.post('/', createNotification);

export default router;
