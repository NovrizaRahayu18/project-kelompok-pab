import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Penjualan from "./PenjualanModel.js";
import Barang from "./BarangModel.js";

const { DataTypes } = Sequelize;

const DetailPenjualan = db.define("detail_penjualan", {
    id_detail: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_penjualan: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_barang: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    jumlah: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    harga_satuan: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    subtotal: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    freezeTableName: true,
    timestamps: false,
    createdAt: false,
    updatedAt: false,
});

DetailPenjualan.belongsTo(Barang, { 
    foreignKey: 'id_barang', 
    as: 'barang' 
});

DetailPenjualan.belongsTo(Penjualan, { 
    foreignKey: 'id_penjualan', 
    as: 'penjualan' 
});

Penjualan.hasMany(DetailPenjualan, { 
    foreignKey: 'id_penjualan', 
    as: 'detail_penjualan' 
});

(async () => {
    try {
        await db.sync();
        console.log("Tabel Detail Penjualan berhasil disinkron.");
    } catch (err) {
        console.error("Gagal menyinkronkan tabel Detail Penjualan:", err);
    }
})();

export default DetailPenjualan;