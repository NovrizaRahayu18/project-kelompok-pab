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

router.get("/api/barang", verifyToken, checkRole(['owner','supervisor','petugas']), getBarang);
router.get("/api/barang/:id", verifyToken, checkRole(['owner','supervisor','petugas']), getBarangById);
router.post("/api/barang", verifyToken, checkRole(['owner','supervisor']), createBarang);
router.put("/api/barang/:id", verifyToken, checkRole(['owner','supervisor','petugas']), updateBarang);
router.delete("/api/barang/:id", verifyToken, checkRole(['owner','supervisor']), deleteBarang);

export default router;