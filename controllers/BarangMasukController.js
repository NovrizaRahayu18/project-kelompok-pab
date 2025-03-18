import Barang from "../models/BarangModel.js";
import BarangMasuk from "../models/BarangMasukModel.js";
import db from "../config/Database.js";
import moment from 'moment';

export const getBarangMasuk = async (req, res) => {
    try {
        const response = await BarangMasuk.findAll({
            include: [{
                model: Barang,
                as: 'barang',
                attributes: ['nama_barang']
            }]
        });
        res.json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const getBarangMasukById = async (req, res) => {
    try {
        const response = await BarangMasuk.findOne({
            where: { id_barang_masuk: req.params.id },
            include: [{
                model: Barang,
                as: 'barang',
                attributes: ['nama_barang']
            }]
        });
        res.json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const createBarangMasuk = async (req, res) => {
    const t = await db.transaction();
    
    try {
        const { id_barang, jumlah, tanggal_masuk, keterangan } = req.body;

        const tanggalFormat = moment(tanggal_masuk).format("YYYY-MM-DD");

        const barangMasuk = await BarangMasuk.create({
            id_barang,
            jumlah,
            tanggal_masuk: tanggalFormat, 
            keterangan
        }, { transaction: t });

        // Update stok in data_barang
        await Barang.increment('stok', {
            by: jumlah,
            where: { id_barang: id_barang },
            transaction: t
        });

        await t.commit();
        res.status(201).json({
            msg: "Barang masuk berhasil ditambahkan",
            data: barangMasuk
        });
    } catch (error) {
        await t.rollback();
        res.status(400).json({ msg: error.message });
    }
}

export const updateBarangMasuk = async (req, res) => {
    const t = await db.transaction();
    
    try {
        const barangMasuk = await BarangMasuk.findOne({
            where: { id_barang_masuk: req.params.id }
        });

        if (!barangMasuk) {
            return res.status(404).json({ msg: "Data tidak ditemukan" });
        }

        const { jumlah, tanggal_masuk, keterangan } = req.body;
        const selisihStok = jumlah - barangMasuk.jumlah;
        const tanggalFormat = moment(tanggal_masuk).format('YYYY-MM-DD');

        // Update barang masuk
        await BarangMasuk.update({
            jumlah,
            tanggal_masuk: tanggalFormat,
            keterangan
        }, {
            where: { id_barang_masuk: req.params.id },
            transaction: t
        });

        // Update stok jika jumlah berubah
        if (selisihStok !== 0) {
            await Barang.increment('stok', {
                by: selisihStok,
                where: { id_barang: barangMasuk.id_barang },
                transaction: t
            });
        }

        await t.commit();
        res.status(200).json({ msg: "Barang masuk berhasil diupdate" });
    } catch (error) {
        await t.rollback();
        res.status(400).json({ msg: error.message });
    }
}

export const deleteBarangMasuk = async (req, res) => {
    const t = await db.transaction();
    
    try {
        const barangMasuk = await BarangMasuk.findOne({
            where: { id_barang_masuk: req.params.id }
        });

        if (!barangMasuk) {
            return res.status(404).json({ msg: "Data tidak ditemukan" });
        }

        // Decrease stok
        await Barang.decrement('stok', {
            by: barangMasuk.jumlah,
            where: { id_barang: barangMasuk.id_barang },
            transaction: t
        });

        // Delete barang masuk
        await BarangMasuk.destroy({
            where: { id_barang_masuk: req.params.id },
            transaction: t
        });

        await t.commit();
        res.status(200).json({ msg: "Barang masuk berhasil dihapus" });
    } catch (error) {
        await t.rollback();
        res.status(400).json({ msg: error.message });
    }
}