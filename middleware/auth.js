import jwt from 'jsonwebtoken';

const SECRET_KEY = 'ravenous-oi-oi-4444'; // kunci

export const createToken = (user) => {
  return jwt.sign(
    { id: user.id_user, username: user.username, role: user.role, nama_lengkap: user.nama_lengkap },
    SECRET_KEY,
    { expiresIn: '6h' }
  );
};

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  console.log(token);

  if (!token) {
    return res.redirect('/login');
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    console.log("Token Valid",decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token tidak valid:", error.message);
    res.clearCookie('token');
    return res.redirect('/login');
  }
};

export const checkRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).send('Forbidden: Insufficient permissions');
    }
    next();
  };
};