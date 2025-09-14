import express from 'express';
import { authenticate, authorize } from '../middlewares/auth.js';
import { 
  updateRating, 
  deleteRating, 
  getRatingsByUser, 
  getAllRatings, 
  getRecentRatings 
} from '../controllers/ratingController.js';

const router = express.Router();

// Existing routes
router.put('/:ratingId', authenticate, authorize(['NORMAL_USER']), updateRating);
router.delete('/:ratingId', authenticate, authorize(['NORMAL_USER','SYSTEM_ADMINISTRATOR']), deleteRating);
router.get('/user/:userId', authenticate, authorize(['SYSTEM_ADMINISTRATOR', 'NORMAL_USER', 'STORE_OWNER']), getRatingsByUser);

// New routes
router.get('/all', authenticate, authorize(['SYSTEM_ADMINISTRATOR']), getAllRatings);
router.get('/recent', authenticate, authorize(['SYSTEM_ADMINISTRATOR', 'STORE_OWNER']), getRecentRatings);

export default router;