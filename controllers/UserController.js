import User from "../models/UserModel.js";
import bcrypt from "bcrypt";
import { Op } from "sequelize";

export const getUser = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const offset = limit * page;
    const accessRole = req.query.accessRole || "admin";
    const search = req.query.search || ""; // Ambil query pencarian dari frontend

    // Filter untuk supervisor (hanya melihat role "petugas")
    let whereClause = {};
    if (accessRole === "supervisor") {
      whereClause.role = "petugas";
    }

    // Tambahkan pencarian jika search query ada
    if (search) {
      whereClause[Op.or] = [
        { nama_lengkap: { [Op.like]: `%${search}%` } }, // Pencarian nama_lengkap
        { role: { [Op.like]: `%${search}%` } }, // Pencarian role
        { username: { [Op.like]: `%${search}%` } }, // Pencarian username
      ];
    }

    const totalRows = await User.count({ where: whereClause });
    const totalPages = Math.ceil(totalRows / limit);

    const response = await User.findAll({
      where: whereClause,
      offset: offset,
      limit: limit,
      order: [["id_user", "ASC"]],
    });

    res.json({
      result: response,
      page: page,
      limit: limit,
      totalRows: totalRows,
      totalPages: totalPages,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Server Error" });
  }
};


export const getUserById = async (req, res) => {
  try {
    const response = await User.findOne({
      where: {
        id_user: req.params.id,
      },
    });
    res.json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const createUser = async (req, res) => {
  const { username, password, role, nama_lengkap } = req.body;

  try {
    // Periksa apakah username sudah ada
    const existingUser = await User.findOne({ where: { username: username } });

    if (existingUser) {
      return res.status(400).json({ msg: "Username already exists" });
    }

    // Jika username belum ada, lanjutkan proses pembuatan user
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    await User.create({
      username: username,
      password: hashPassword,
      role: role,
      nama_lengkap: nama_lengkap,
    });

    res.status(201).json({ msg: "User Created Successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Error creating user" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        id_user: req.params.id,
      },
    });

    if (!user) return res.status(404).json({ msg: "No Data Found" });

    const { username, password, role, nama_lengkap } = req.body;

    // Periksa apakah username yang baru sudah digunakan oleh user lain
    if (username && username !== user.username) {
      const existingUser = await User.findOne({
        where: { username: username },
      });
      if (existingUser) {
        return res.status(400).json({ msg: "Username already exists" });
      }
    }

    // Hash password jika ada password baru
    let hashedPassword;
    if (password && password !== "") {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    // Update user dengan password yang sudah di-hash
    await User.update(
      {
        username: username,
        password: hashedPassword || user.password, // Gunakan password baru jika ada, jika tidak gunakan password lama
        role: role,
        nama_lengkap: nama_lengkap,
      },
      {
        where: {
          id_user: req.params.id,
        },
      }
    );

    res.status(200).json({ msg: "User Updated Successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Error updating user" });
  }
};

export const deleteUser = async (req, res) => {
  const user = await User.findOne({
    where: {
      id_user: req.params.id,
    },
  });
  if (!user) return res.status(404).json({ msg: "No Data Found" });

  try {
    await User.destroy({
      where: {
        id_user: req.params.id,
      },
    });
    res.status(200).json({ msg: "User Deleted Successfully" });
  } catch (error) {
    console.log(error.message);
  }
};
