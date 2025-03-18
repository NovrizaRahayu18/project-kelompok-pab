import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Barang from "./BarangModel.js";

const {DataTypes} = Sequelize;

const BarangMasuk = db.define("barang_masuk",{
    id_barang_masuk: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_barang: {
        type: DataTypes.STRING,
        allowNull: false ,
        references: {           // Kalau error ini references hapus aja
            model: Barang,
            key: 'id_barang'
        }
    },
    tanggal_masuk: {
        type: DataTypes.DATE,  
        defaultValue: Sequelize.NOW, 
        allowNull: false 
    },
    jumlah: {
        type: DataTypes.STRING,
        allowNull: false 
    },
    keterangan: {
        type: DataTypes.STRING,
        allowNull: true 
    }
},{
    freezeTableName: true,
    timestamps: false,
    createdAt: false,
    updatedAt: false
});

BarangMasuk.belongsTo(Barang, { 
    foreignKey: 'id_barang',
    as: 'barang', 
    onDelete: 'CASCADE'
});

export default BarangMasuk;

(async () => {
    try {
        await db.sync({alter: true});
        console.log("Tabel Barang Masuk berhasil disinkron.");
    } catch (err) {
        console.error("Gagal menyinkronkan tabel Barang Masuk:", err);
    }
})();
