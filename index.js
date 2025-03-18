import express from "express";
import fileUpload from "express-fileupload";
import cors from "cors";
import path from "path";
import BarangRoute from "./routes/BarangRoute.js";
import UserRoute from "./routes/UserRoute.js";
import BarangMasukRoute from "./routes/BarangMasukRoute.js";
import PenjualanRoute from "./routes/PenjualanRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
import { verifyToken, checkRole } from "./middleware/auth.js";
import cookieParser from "cookie-parser";

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const hostname = "127.0.0.1";
const port = 3000;

app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(fileUpload());
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "views")));
app.use(BarangRoute);
app.use(UserRoute);
app.use(BarangMasukRoute);
app.use(PenjualanRoute);
app.use(AuthRoute);

app.get("/", verifyToken, (req, res) => {
  // Redirect based on user role
  if (req.user.role === "owner") {
      res.redirect("/owner");
  } else if (req.user.role === "admin") {
      res.redirect("/admin");
  } else if (req.user.role === "supervisor") {
      res.redirect("/supervisor");
  } else if (req.user.role === "petugas") {
      res.redirect("/petugas");
  }
});

// Login
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "login.html"));
});

// OWNER
app.use("/owner", verifyToken, checkRole(["owner"]));
app.get("/owner", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "owner", "index.html"));
});

// data barang
app.get("/data-barang", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "owner", "data-barang.html"));
});
app.get("/tambah-data-barang", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "owner", "tambah-data-barang.html")
  );
});
app.get("/edit-data-barang", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "owner", "edit-data-barang.html"));
});

// data barang masuk
app.get("/data-barang-masuk", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "owner", "data-barang-masuk.html")
  );
});
app.get("/edit-data-barang-masuk", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "owner", "edit-data-barang-masuk.html")
  );
});
app.get("/tambah-data-barang-masuk", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "owner", "tambah-data-barang-masuk.html")
  );
});

// data penjualan
app.get("/data-penjualan", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "owner", "data-penjualan.html"));
});
// data detail penjualan
app.get("/data-detail-penjualan", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "owner", "data-detail-penjualan.html")
  );
});
// data user
app.get("/data-user", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "owner", "data-user.html"));
});
app.get("/tambah-data-user", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "owner", "tambah-data-user.html"));
});
app.get("/edit-data-user", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "owner", "edit-data-user.html"));
});


// // ADMIN
app.use("/admin", verifyToken, checkRole(["admin"]));
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "admin", "index.html"));
});

// data barang
app.get("/data-barang", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "admin", "data-barang.html"));
});
app.get("/tambah-data-barang", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "admin", "tambah-data-barang.html")
  );
});
app.get("/edit-data-barang", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "admin", "edit-data-barang.html"));
});

// data barang masuk
app.get("/data-barang-masuk", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "admin", "data-barang-masuk.html")
  );
});
app.get("/edit-data-barang-masuk", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "admin", "edit-data-barang-masuk.html")
  );
});
app.get("/tambah-data-barang-masuk", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "admin", "tambah-data-barang-masuk.html")
  );
});

// Supervisor
app.use("/supervisor", verifyToken, checkRole(["supervisor"]));
app.get("/supervisor", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "supervisor", "index.html"));
});

app.get("/kasir", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "supervisor", "kasir.html"));
});

app.get("/data-penjualan", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "supervisor", "data-penjualan.html"));
});

app.get("/data-detail-penjualan", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "supervisor", "data-detail-penjualan.html")
  );
});

// data user
app.get("/data-user", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "supervisor", "data-user.html"));
});
app.get("/tambah-data-user", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "supervisor", "tambah-data-user.html"));
});
app.get("/edit-data-user", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "supervisor", "edit-data-user.html"));
});




// PETUGAS
app.use("/petugas", verifyToken, checkRole(["petugas"]));
app.get("/petugas", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "petugas", "index.html"));
});

app.get("/kasir", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "petugas", "kasir.html"));
});

app.get("/data-penjualan", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "petugas", "data-penjualan.html"));
});

app.get("/data-detail-penjualan", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "petugas", "data-detail-penjualan.html")
  );
});

app.listen(port, hostname, () => {
  console.log(`Server berjalan pada http://${hostname}:${port}`);
});
