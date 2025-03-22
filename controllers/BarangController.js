import Barang from "../models/BarangModel.js";
import path from "path";
import fs from "fs";
import { Op } from "sequelize";


export const getBarang = async (req, res) => {
  try {
    // Cek apakah client meminta semua data
    const getAllData = req.query.all === "true";

    if (getAllData) {
      // Jika meminta semua data, abaikan pagination
      const response = await Barang.findAll({
        order: [["id_barang", "ASC"]],
      });

      return res.json({
        result: response,
        totalRows: response.length,
      });
    } else {
      // Kode pagination
      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 5;
      const offset = limit * page;
      const totalRows = await Barang.count();
      const totalPages = Math.ceil(totalRows / limit);

      const response = await Barang.findAll({
        offset: offset,
        limit: limit,
        order: [["id_barang", "ASC"]],
      });

      return res.json({
        result: response,
        page: page,
        limit: limit,
        totalRows: totalRows,
        totalPages: totalPages,
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Server Error" });
  }
};

export const getBarangById = async(req, res) => {
    try {
        const response = await Barang.findOne({
            where:{
                id_barang : req.params.id
            }
        });
        res.json(response);
    } catch (error) {
        console.log(error.message);
    }
}

export const createBarang = async (req, res) => {
  if (req.files === null)
    return res.status(400).json({ msg: "No file uploaded" });

  const namaBarang = req.body.nama_barang;
  const hargaBeli = req.body.harga_beli;
  const hargaJual = req.body.harga_jual;
  const stok = req.body.stok;
  const file = req.files.file;
  const fileSize = file.data.length;
  const ext = path.extname(file.name);
  const fileName = file.md5 + Date.now() + ext;
  const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
  const allowedType = [".png", ".jpg", ".jpeg"];

  if (!allowedType.includes(ext.toLowerCase()))
    return res.status(422).json({ msg: "Invalid Image" });
  if (fileSize > 5000000)
    return res.status(422).json({ msg: "Image must be less than 5mb" });

  try {
    // Cek apakah nama_barang sudah ada
    const existingBarang = await Barang.findOne({
      where: {
        nama_barang: namaBarang,
      },
    });

    if (existingBarang) {
      return res.status(400).json({ msg: "Barang already exists" });
    }

    // Pindahkan file dan buat barang baru jika nama_barang tidak ada
    file.mv(`./public/images/${fileName}`, async (err) => {
      if (err) return res.status(500).json({ msg: err.message });

      try {
        await Barang.create({
          nama_barang: namaBarang,
          gambar: fileName,
          url: url,
          harga_beli: hargaBeli,
          harga_jual: hargaJual,
          stok: stok,
        });
        res.status(201).json({ msg: "Product Created Successfully" });
      } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: "Error creating product" });
      }
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Error checking existing barang" });
  }
};

export const updateBarang = async (req, res) => {
  try {
    // Cari barang berdasarkan ID
    const barang = await Barang.findOne({
      where: {
        id_barang: req.params.id,
      },
    });

    if (!barang) return res.status(404).json({ msg: "No Data Found" });

    // Validasi nama_barang apakah sudah ada (selain barang yang sedang di-update)
    const namaBarang = req.body.nama_barang;
    const existingBarang = await Barang.findOne({
      where: {
        nama_barang: namaBarang,
        id_barang: { [Op.ne]: req.params.id }, // ID barang yang berbeda
      },
    });

    if (existingBarang)
      return res.status(400).json({ msg: "Nama barang already exists" });

    // Proses upload file jika ada file baru
    let fileName = barang.gambar;
    if (req.files !== null) {
      const file = req.files.file;
      const fileSize = file.data.length;
      const ext = path.extname(file.name);
      fileName = file.md5 + ext;
      const allowedType = [".png", ".jpg", ".jpeg"];

      if (!allowedType.includes(ext.toLowerCase()))
        return res.status(422).json({ msg: "Invalid Image" });
      if (fileSize > 5000000)
        return res.status(422).json({ msg: "Image must be less than 5mb" });

      const filepath = `./public/images/${barang.gambar}`;
      fs.unlinkSync(filepath);

      file.mv(`./public/images/${fileName}`, (err) => {
        if (err) return res.status(500).json({ msg: err.message });
      });
    }

    // Update data barang
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    const hargaBeli = req.body.harga_beli;
    const hargaJual = req.body.harga_jual;
    const stok = req.body.stok;

    await Barang.update(
      {
        nama_barang: namaBarang,
        gambar: fileName,
        url: url,
        harga_beli: hargaBeli,
        harga_jual: hargaJual,
        stok: stok,
      },
      {
        where: {
          id_barang: req.params.id,
        },
      }
    );

    res.status(200).json({ msg: "Product Updated Successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Error updating product" });
  }
};


export const deleteBarang = async(req, res) => {
    const barang = await Barang.findOne({
        where: {    
            id_barang: req.params.id
        }
    });
    if(!barang) return res.status(404).json({msg: "No Data Found"});

    try {
        const filepath = `./public/images/${barang.gambar}`;
        fs.unlinkSync(filepath);
        await Barang.destroy({
            where: {
                id_barang: req.params.id
            }
        });
        res.status(200).json({msg: "Product Deleted Successfully"});
    } catch (error) {
        console.log(error.message);
    }
}
