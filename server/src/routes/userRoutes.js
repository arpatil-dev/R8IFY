import express from "express";
import {
  updatePassword,
  getProfile,
  updateProfile,
  createUser,
  getUsers,
  updateUser,
  deleteUser,
  getUserById,
  getRecentUsersController
} from "../controllers/userController.js";
import { authenticate, authorize } from "../middlewares/auth.js";

const router = express.Router();

// ✅ Protected routes (login required)
router.get("/me", authenticate, getProfile);           // Get own profile info
router.get("/",authenticate, authorize(['SYSTEM_ADMINISTRATOR']), getUsers); // Placeholder for getting all users if needed
router.get("/recent", authenticate, authorize(['SYSTEM_ADMINISTRATOR']), getRecentUsersController); // Get recent users
router.post("/", authenticate, authorize(['SYSTEM_ADMINISTRATOR']),createUser ); // Placeholder for user creation if needed

router.put("/password", authenticate, authorize(['NORMAL_USER', 'SYSTEM_ADMINISTRATOR', 'STORE_OWNER']), updatePassword); // Update password
router.put("/profile", authenticate, authorize(['NORMAL_USER', 'SYSTEM_ADMINISTRATOR', 'STORE_OWNER']), updateProfile); // Update own profile

router.put("/:id", authenticate, authorize(['SYSTEM_ADMINISTRATOR','NORMAL_USER','STORE_OWNER']), updateUser); // Update user by ID
router.delete("/:id", authenticate, authorize(['SYSTEM_ADMINISTRATOR']), deleteUser); // Delete user by ID
router.get("/:id", authenticate, authorize(['SYSTEM_ADMINISTRATOR']), getUserById); // Get user by ID (if needed)

export default router;

