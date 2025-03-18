import User from "../models/UserModel.js";
import bcrypt from "bcrypt";
import { createToken } from "../middleware/auth.js";

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        const user = await User.findOne({
            where: {
                username: username
            }
        });

        if (!user) {
            return res.status(401).json({
                message: "Username atau password salah"
            });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({
                message: "Username atau password salah"
            });
        }

        const token = createToken(user);

        res.cookie('token', token, {
            httpOnly: true,
            secure: true, 
            sameSite: 'strict', 
            maxAge: 6 * 60 * 60 * 1000
        });

        res.cookie('nama_lengkap', user.nama_lengkap, {
            secure: true,
            sameSite: 'strict',
            maxAge: 6 * 60 * 60 * 1000
        });

        res.cookie('role', user.role, {
            secure: true,
            sameSite: 'strict',
            maxAge: 6 * 60 * 60 * 1000
        });

        if (user.role === 'owner') {
            res.json({ redirect: '/owner' });
        } else if (user.role === "admin") {
          res.json({ redirect: "/admin" });
        } else if (user.role === 'supervisor') {
            res.json({ redirect: '/supervisor' });
        } else {
            res.json({redirect: '/petugas'})
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Terjadi kesalahan pada server"
        });
    }
};

export const getUserData = (req, res) => {
    const token = req.cookies.token; 

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const user = jwt.verify(token, 'ravenous-oi-oi-4444'); 
        res.status(200).json({
            nama_lengkap: user.nama_lengkap,
            role: user.role,
        });
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Invalid token' });
    }
};