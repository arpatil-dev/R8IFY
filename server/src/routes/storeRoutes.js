import express from "express";
import { authenticate, authorize } from "../middlewares/auth.js";
import { 
  createStore,
  getAllStores, 
  getStoreByStoreId, 
  getStoresByOwner,
  updateStore,
  deleteStore,
  submitRating,
  getRatingsForStore,
  updateRating,
  deleteRating,
  getAverageRating,
  addOwnerToStore
} from "../controllers/storeController.js";

const router = express.Router();

router.post('/', authenticate, authorize(['SYSTEM_ADMINISTRATOR']), createStore);
router.get('/', authenticate, authorize(['SYSTEM_ADMINISTRATOR','NORMAL_USER']), getAllStores);
router.get('/:storeId', authenticate, authorize(['SYSTEM_ADMINISTRATOR','NORMAL_USER']), getStoreByStoreId);
router.get('/owner/:ownerId', authenticate, authorize(['SYSTEM_ADMINISTRATOR','STORE_OWNER']), getStoresByOwner);
router.put('/:storeId', authenticate, authorize(['SYSTEM_ADMINISTRATOR']), updateStore);
router.delete('/:storeId', authenticate, authorize(['SYSTEM_ADMINISTRATOR']), deleteStore);

router.post('/:storeId/ratings', authenticate, authorize(['NORMAL_USER']), submitRating);
router.get('/:storeId/ratings', authenticate, authorize(['SYSTEM_ADMINISTRATOR','STORE_OWNER']), getRatingsForStore);
router.get('/:storeId/average-rating', authenticate, authorize(['SYSTEM_ADMINISTRATOR','STORE_OWNER','NORMAL_USER']), getAverageRating);




export default router;
