import { Router } from 'express';
import { createVenue, getVenues, deleteVenue } from '../controllers/venueController';

const router = Router();

router.post('/', createVenue);
router.get('/:collegeId', getVenues);
router.delete('/:id', deleteVenue);

export default router;
