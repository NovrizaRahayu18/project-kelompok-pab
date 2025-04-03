import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import User from "./UserModel.js";

const { DataTypes } = Sequelize;

const Penjualan = db.define("penjualan",{
    id_penjualan: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tanggal_penjualan: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    total_harga: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    uang_bayar: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    kembalian: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id_user",
      }
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
    createdAt: false,
    updatedAt: false,
  }
);

Penjualan.belongsTo(User, {
  foreignKey: "id_user",
  as: "user",
  onDelete: "CASCADE",
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