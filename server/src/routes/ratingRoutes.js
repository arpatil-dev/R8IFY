import express from 'express';
import { authenticate, authorize } from '../middlewares/auth.js';
import { updateRating, deleteRating, getRatingsByUser } from '../controllers/ratingController.js';
const router = express.Router();

router.put('/:ratingId', authenticate, authorize(['NORMAL_USER']), updateRating);
router.delete('/:ratingId', authenticate, authorize(['NORMAL_USER','SYSTEM_ADMINISTRATOR']), deleteRating);
router.get('/user/:userId', authenticate, authorize(['SYSTEM_ADMINISTRATOR', 'NORMAL_USER', 'STORE_OWNER']), getRatingsByUser);

export default router;