import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const {DataTypes} = Sequelize;

const User = db.define("user",{
    id_user: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('owner','admin', 'supervisor', 'petugas'),
        allowNull: false
    },
    nama_lengkap: {
        type: DataTypes.STRING,
        allowNull: false
    }
},{
    freezeTableName: true,
    timestamps: false,
    createdAt: false,
    updatedAt: false
});

export default User;

(async () => {
    try {
        await db.sync();
        console.log("Tabel User berhasil disinkron.");
    } catch (err) {
        console.error("Gagal menyinkronkan tabel User:", err);
    }
})();
