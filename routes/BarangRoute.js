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

router.get("/api/barang", verifyToken, checkRole(['owner','supervisor','admin', 'petugas']), getBarang);
router.get("/api/barang/:id", verifyToken, checkRole(['owner','supervisor', 'admin', 'petugas']), getBarangById);
router.post("/api/barang", verifyToken, checkRole(['owner','admin']), createBarang);
router.put("/api/barang/:id", verifyToken, checkRole(['owner','supervisor','admin','petugas']), updateBarang);
router.delete("/api/barang/:id", verifyToken, checkRole(['owner','admin']), deleteBarang);

export default router;