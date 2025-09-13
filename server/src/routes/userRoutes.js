import express from "express";
import {
  updatePassword,
  getProfile,
  createUser,
  getUsers,
  updateUser,
  deleteUser,
  getUserById
} from "../controllers/userController.js";
import { authenticate, authorize } from "../middlewares/auth.js";

const router = express.Router();

// ✅ Protected routes (login required)
router.get("/",authenticate, authorize(['SYSTEM_ADMINISTRATOR']), getUsers); // Placeholder for getting all users if needed
router.post("/", authenticate, authorize(['SYSTEM_ADMINISTRATOR']),createUser ); // Placeholder for user creation if needed

router.put("/password", authenticate, authorize(['NORMAL_USER', 'SYSTEM_ADMINISTRATOR', 'STORE_OWNER']), updatePassword); // Update password

router.put("/:id", authenticate, authorize(['SYSTEM_ADMINISTRATOR']), updateUser); // Update user by ID
router.delete("/:id", authenticate, authorize(['SYSTEM_ADMINISTRATOR']), deleteUser); // Delete user by ID
router.get("/:id", authenticate, authorize(['SYSTEM_ADMINISTRATOR']), getUserById); // Get user by ID (if needed)
router.get("/me", authenticate, getProfile);           // Get own profile info

export default router;

