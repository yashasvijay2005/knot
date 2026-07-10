import { Router } from 'express';
import { createEventCategory, getEventCategories, deleteEventCategory } from '../controllers/eventCategoryController';

const router = Router();

router.post('/', createEventCategory);
router.get('/', getEventCategories);
router.delete('/:id', deleteEventCategory);

export default router;
