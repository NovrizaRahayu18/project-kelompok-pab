import express from "express";
import { verifyToken, checkRole } from "../middleware/auth.js";

import {
    getUser,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} from "../controllers/UserController.js";

const router = express.Router();

router.get("/api/user", verifyToken, checkRole(["owner", "supervisor"]), getUser);
router.get("/api/user/:id", verifyToken, checkRole(['owner', 'supervisor']), getUserById);
router.post("/api/user", verifyToken, checkRole(['owner', 'supervisor']), createUser);
router.put("/api/user/:id", verifyToken, checkRole(['owner', 'supervisor']), updateUser);
router.delete("/api/user/:id", verifyToken, checkRole(['owner', 'supervisor']), deleteUser);

export default router;