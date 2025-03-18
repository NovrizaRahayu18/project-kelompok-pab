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

router.get("/api/user", verifyToken, checkRole(["owner", "admin"]), getUser);
router.get("/api/user/:id", verifyToken, checkRole(['owner', 'admin']), getUserById);
router.post("/api/user", verifyToken, checkRole(['owner', 'admin']), createUser);
router.put("/api/user/:id", verifyToken, checkRole(['owner', 'admin']), updateUser);
router.delete("/api/user/:id", verifyToken, checkRole(['owner', 'admin']), deleteUser);

export default router;