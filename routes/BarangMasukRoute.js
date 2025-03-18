import express from 'express';
import { verifyToken, checkRole } from "../middleware/auth.js";

import {
    getBarangMasuk,
    getBarangMasukById,
    createBarangMasuk,
    updateBarangMasuk,
    deleteBarangMasuk
} from "../controllers/BarangMasukController.js";

const router = express.Router();

router.get("/api/barang-masuk", verifyToken, checkRole(['owner','admin']), getBarangMasuk);
router.get("/api/barang-masuk/:id", verifyToken, checkRole(['owner','admin']), getBarangMasukById);
router.post("/api/barang-masuk", verifyToken, checkRole(['owner','admin']), createBarangMasuk);
router.put("/api/barang-masuk/:id", verifyToken, checkRole(['owner','admin']), updateBarangMasuk);
router.delete("/api/barang-masuk/:id", verifyToken, checkRole(['owner','admin']), deleteBarangMasuk);

export default router;