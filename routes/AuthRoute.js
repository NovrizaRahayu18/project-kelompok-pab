import express from 'express';
import { login, getUserData } from "../controllers/AuthController.js";
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post("/api/login", login);
router.get("/api/user", verifyToken ,getUserData);
router.get("/api/logout", (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict'
    });
    return res.redirect('/login');
});

export default router;