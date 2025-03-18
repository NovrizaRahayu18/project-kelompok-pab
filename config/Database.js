import { Sequelize } from "sequelize";

const db = new Sequelize("db_family_foto", "root", "",{
    host: "localhost",
    dialect: "mysql"
});

db.authenticate()
    .then(() => {
        console.log("Berhasil terhubung ke database.");
    })
    .catch(err => {
        console.log("Gagal terhubung ke database.", err);
    });

export default db;

