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

router.get("/api/barang-masuk", verifyToken, checkRole(['owner','admin persediaan']), getBarangMasuk);
router.get("/api/barang-masuk/:id", verifyToken, checkRole(['owner','admin persediaan']), getBarangMasukById);
router.post("/api/barang-masuk", verifyToken, checkRole(['owner','admin persediaan']), createBarangMasuk);
router.put("/api/barang-masuk/:id", verifyToken, checkRole(['owner','admin persediaan']), updateBarangMasuk);
router.delete("/api/barang-masuk/:id", verifyToken, checkRole(['owner','admin persediaan']), deleteBarangMasuk);

export default router;