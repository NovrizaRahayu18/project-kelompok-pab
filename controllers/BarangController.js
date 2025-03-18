import Barang from "../models/BarangModel.js";
import path from "path";
import fs from "fs";

export const getBarang = async(req, res) => {
    try {
        const response = await Barang.findAll();
        res.json(response);
    } catch (error) {
        console.log(error.message);
    }
}

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

export const createBarang = (req, res) => {
    if(req.files === null) return res.status(400).json({msg: "No file uploaded"});

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

    if(!allowedType.includes(ext.toLowerCase())) return res.status(422).json({msg: "Invalid Image"});
    if(fileSize > 5000000) return res.status(422).json({msg: "Image must be less than 5mb"});

    file.mv(`./public/images/${fileName}`, async(err) => {
        if(err) return res.status(500).json({msg: err.message});
        try {
            await Barang.create({nama_barang: namaBarang, gambar: fileName, url: url, harga_beli: hargaBeli, harga_jual: hargaJual, stok: stok});
            res.status(201).json({msg: "Product Created Successfuly"});
        } catch (error) {
            console.log(error.message);
        }
    });
}

export const updateBarang = async(req, res) => {
    const barang = await Barang.findOne({
        where: {    
            id_barang: req.params.id
        }
    });
    if(!barang) return res.status(404).json({msg: "No Data Found"});

    let fileName = barang.gambar; 
    if (req.files !== null) {
        const file = req.files.file;
        const fileSize = file.data.length;
        const ext = path.extname(file.name);
        fileName = file.md5 + ext;  
        const allowedType = [".png", ".jpg", ".jpeg"];
        
        if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ msg: "Invalid Image" });
        if (fileSize > 5000000) return res.status(422).json({ msg: "Image must be less than 5mb" });

        const filepath = `./public/images/${barang.gambar}`;
        fs.unlinkSync(filepath);

        file.mv(`./public/images/${fileName}`, (err) => {
            if (err) return res.status(500).json({ msg: err.message });
        });
    }


    const namaBarang = req.body.nama_barang;
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    const hargaBeli = req.body.harga_beli; 
    const hargaJual = req.body.harga_jual; 
    const stok = req.body.stok;

    try {
        await Barang.update({nama_barang: namaBarang, gambar: fileName, url: url, harga_beli: hargaBeli, harga_jual: hargaJual, stok: stok}, {
            where: {
                id_barang: req.params.id
            }
        });
        res.status(200).json({msg: "Product Updated Successfully"});
    } catch (error) {
        console.log(error.message);
    }
}

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
