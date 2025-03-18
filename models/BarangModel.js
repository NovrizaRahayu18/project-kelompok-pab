import { Sequelize } from "sequelize";
import db from "../config/Database.js";
const {DataTypes} = Sequelize;

const Barang = db.define("barang",{
    id_barang: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nama_barang: {
        type: DataTypes.STRING,
        allowNull: false
    },
    gambar: {
        type: DataTypes.STRING,
        allowNull: false
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    harga_beli: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    harga_jual: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    stok: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
},{
    freezeTableName: true,
    timestamps: false,
    createdAt: false,
    updatedAt: false
});

export default Barang;

(async () => {
    try {
        await db.sync();
        console.log("Tabel Barang berhasil disinkron.");
    } catch (err) {
        console.error("Gagal menyinkronkan tabel Barang:", err);
    }
})();
