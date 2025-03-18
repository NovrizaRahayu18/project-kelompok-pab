import express from "express";
import { verifyToken, checkRole } from "../middleware/auth.js";

import {
    getBarang,
    getBarangById,
    createBarang,
    updateBarang,
    deleteBarang
} from "../controllers/BarangController.js";

const router = express.Router();

router.get("/api/barang", verifyToken, checkRole(['owner','admin']), getBarang);
router.get("/api/barang/:id", verifyToken, checkRole(['owner','admin']), getBarangById);
router.post("/api/barang", verifyToken, checkRole(['owner','admin']), createBarang);
router.put("/api/barang/:id", verifyToken, checkRole(['owner','admin']), updateBarang);
router.delete("/api/barang/:id", verifyToken, checkRole(['owner','admin']), deleteBarang);

export default router;