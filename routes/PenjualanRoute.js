import express from 'express';
import { verifyToken, checkRole } from '../middleware/auth.js';

import {
    getPenjualan,
    getPenjualanById,
    getDetailPenjualanById,
    createPenjualan,
    checkBarangInSales,
    getDashboardStats,
    deletePenjualan
} from '../controllers/PenjualanController.js';

const router = express.Router();

// Route penjualan
router.get('/api/penjualan', verifyToken, 
  checkRole(['owner', 'petugas', 'supervisor']), getPenjualan);

router.get('/api/penjualan/:id', verifyToken, 
    checkRole(['owner', 'petugas', 'supervisor']), getPenjualanById);

// Ini untuk detail penjualan
router.get("/api/detail-penjualan/:id", verifyToken,
  checkRole([("owner","petugas", "supervisor")]),getDetailPenjualanById
);

// Route untuk membuat penjualan baru
router.post("/api/penjualan", verifyToken,
  checkRole([("owner", "petugas", "supervisor")]), createPenjualan
);

// Cek barang sudah dipakai di penjualan
router.get('/api/barang/check-penjualan/:id', verifyToken, 
    checkRole(['owner', 'petugas', 'supervisor']), checkBarangInSales);

router.get('/api/dashboard-stats', verifyToken, 
    checkRole(['owner','petugas', 'supervisor']), getDashboardStats);

// Route untuk delete penjualan
router.delete('/api/penjualan/:id', verifyToken, checkRole(['owner','admin','supervisor']), deletePenjualan);

export default router;