import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Penjualan = db.define("penjualan", {
    id_penjualan: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    tanggal_penjualan: {
        type: DataTypes.DATE,
        allowNull: false
    },
    total_harga: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    uang_bayar: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    kembalian: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    freezeTableName: true,
    timestamps: false,
    createdAt: false,
    updatedAt: false,
});

export default Penjualan;

(async () => {
    try {
        await db.sync();
        console.log("Tabel Penjualan berhasil disinkron.");
    } catch (err) {
        console.error("Gagal menyinkronkan tabel Penjualan:", err);
    }
})();