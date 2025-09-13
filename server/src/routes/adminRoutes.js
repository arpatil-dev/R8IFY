    import express from "express";
    import { authenticate, authorize } from "../middlewares/auth.js";
    import { createStore, createUser, getUsers, getStores, getStats } from "../controllers/adminController.js";

    const router = express.Router();

    // Only ADMIN can access these
    router.post("/users", authenticate, authorize(["SYSTEM_ADMINISTRATOR"]), createUser);
    router.get("/users", authenticate, authorize(["SYSTEM_ADMINISTRATOR"]), getUsers);
    router.get("/stats", authenticate, authorize(["SYSTEM_ADMINISTRATOR"]), getStats);

    export default router;
