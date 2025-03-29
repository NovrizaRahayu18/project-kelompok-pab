import Penjualan from "../models/PenjualanModel.js";
import DetailPenjualan from "../models/DetailPenjualanModel.js";
import Barang from "../models/BarangModel.js";
import db from "../config/Database.js";
import moment from 'moment';
import { Op } from "sequelize";


export const getPenjualan = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const offset = limit * page;

    // Add date filtering
    const { startDate, endDate } = req.query;

    // Prepare where conditions for filtering
    const whereCondition = {};
    if (startDate && endDate) {
      whereCondition.tanggal_penjualan = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    // Count total rows with filtering
    const totalRows = await Penjualan.count({
      where: whereCondition,
    });
    const totalPages = Math.ceil(totalRows / limit);

    const response = await Penjualan.findAll({
      attributes: [
        "id_penjualan",
        "tanggal_penjualan",
        "total_harga",
        "uang_bayar",
        "kembalian",
      ],
      where: whereCondition,
      offset: offset,
      limit: limit,
      order: [["tanggal_penjualan", "DESC"]],
    });

    const formattedResponse = response.map((item) => ({
      id_penjualan: item.id_penjualan,
      tanggal_penjualan: moment(item.tanggal_penjualan).format("DD-MM-YYYY"),
      total_harga: new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(item.total_harga),
      uang_bayar: new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(item.uang_bayar),
      kembalian: new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(item.kembalian),
    }));

    res.status(200).json({
      result: formattedResponse,
      page: page,
      limit: limit,
      totalRows: totalRows,
      totalPages: totalPages,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Server Error" });
  }
};

// Get detail penjualan berdasarkan id_penjualan
export const getDetailPenjualanById = async (req, res) => {
    try {
        // Get header penjualan
        const penjualan = await Penjualan.findOne({
            where: { id_penjualan: req.params.id },
            attributes: ['id_penjualan', 'tanggal_penjualan', 'total_harga', 'uang_bayar', 'kembalian']
        });

        if (!penjualan) {
            return res.status(404).json({ msg: "Penjualan tidak ditemukan" });
        }

        // Get detail items
        const details = await DetailPenjualan.findAll({
            where: { id_penjualan: req.params.id },
            include: [{
                model: Barang,
                as: 'barang', 
                attributes: ['nama_barang']
            }],
            attributes: [
                'id_detail',
                'jumlah',
                'harga_satuan',
                'subtotal'
            ]
        });

        const formattedPenjualan = {
            id_penjualan: penjualan.id_penjualan,
            tanggal_penjualan: moment(penjualan.tanggal_penjualan).format('DD-MM-YYYY'),
            total_harga: penjualan.total_harga,
            uang_bayar: penjualan.uang_bayar,
            kembalian: penjualan.kembalian,
            formatted: {
                total_harga: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(penjualan.total_harga),
                uang_bayar: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(penjualan.uang_bayar),
                kembalian: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(penjualan.kembalian)
            },
            items: details.map(detail => ({
                id_detail_penjualan: detail.id_detail_penjualan,
                nama_barang: detail.barang.nama_barang, 
                jumlah: detail.jumlah,
                harga_satuan: detail.harga_satuan,
                subtotal: detail.subtotal,
                formatted: {
                    harga_satuan: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(detail.harga_satuan),
                    subtotal: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(detail.subtotal)
                }
            }))
        };

        res.status(200).json(formattedPenjualan);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            msg: "Error saat mengambil detail penjualan",
            error: error.message 
        });
    }
}

export const getPenjualanById = async(req, res) => {
    try {
        const response = await Penjualan.findOne({
            where:{
                id_penjualan : req.params.id
            }
        });
        res.json(response);
    } catch (error) {
        console.log(error.message);
    }
}

export const getDetailPenjualan = async(req, res) => {
    try {
        const response = await DetailPenjualan.findAll({
            where:{
                id_detail_penjualan : req.params.id
            }
        });
        res.json(response);
    } catch (error) {
        console.log(error.message);
    }
}



export const createPenjualan = async (req, res) => {
    const t = await db.transaction();
    
    try {
        const { tanggal_penjualan, total_harga, uang_bayar, kembalian, items } = req.body;
        const tanggalFormat = moment(tanggal_penjualan).format("YYYY-MM-DD");

        //  Create penjualan header
        const penjualan = await Penjualan.create({
            tanggal_penjualan: tanggalFormat,
            total_harga,
            uang_bayar,
            kembalian
        }, { transaction: t });

        // Create detail penjualan dan update stok
        for (const item of items) {
            // Cek stok tersedia
            const barang = await Barang.findOne({
                where: { id_barang: item.id_barang },
                transaction: t
            });

            if (barang.stok < item.jumlah) {
                throw new Error(`Stok ${barang.nama_barang} tidak mencukupi`);
            }

            //  Create detail penjualan
            await DetailPenjualan.create({
                id_penjualan: penjualan.id_penjualan,
                id_barang: item.id_barang,
                jumlah: item.jumlah,
                harga_satuan: item.harga_satuan,
                subtotal: item.jumlah * item.harga_satuan  // Fix: use harga_satuan instead of harga_jual
            }, { transaction: t });

            //  Update stok barang
            await Barang.decrement('stok', {
                by: item.jumlah,
                where: { id_barang: item.id_barang },
                transaction: t
            });
        }

        await t.commit();
        res.status(201).json({
            msg: "Penjualan berhasil ditambahkan",
            data: penjualan
        });
    } catch (error) {
        await t.rollback();
        res.status(400).json({ msg: error.message });
    }
}



export const deletePenjualan = async (req, res) => {
    const t = await db.transaction();
    
    try {
        //  Cek penjualan exist
        const penjualan = await Penjualan.findOne({
            where: { id_penjualan: req.params.id },
            include: [{
                model: DetailPenjualan,
                as: 'detail_penjualan'
            }],
            transaction: t
        });

        if (!penjualan) {
            throw new Error("Penjualan tidak ditemukan");
        }

        //  Kembalikan stok barang
        for (const detail of penjualan.detail_penjualan) {
            await Barang.increment('stok', {
                by: detail.jumlah,
                where: { id_barang: detail.id_barang },
                transaction: t
            });
        }

        //  Hapus detail penjualan
        await DetailPenjualan.destroy({
            where: { id_penjualan: req.params.id },
            transaction: t
        });

        //  Hapus penjualan header
        await Penjualan.destroy({
            where: { id_penjualan: req.params.id },
            transaction: t
        });

        await t.commit();
        res.status(200).json({ msg: "Penjualan berhasil dihapus" });
    } catch (error) {
        await t.rollback();
        res.status(400).json({ msg: error.message });
    }
}

export const checkBarangInSales = async (req, res) => {
    try {
        const barangId = req.params.id;
        const salesCount = await DetailPenjualan.count({
            where: { id_barang: barangId }
        });

        res.json({
            inSales: salesCount > 0
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            msg: "Error saat memeriksa penjualan",
            error: error.message 
        });
    }
}

export const getDashboardStats = async (req, res) => {
  try {
    const { month, year, date } = req.query;

    let totalTransaksi = 0,
      totalPendapatan = 0;

    if (date) {
      // Filter berdasarkan tanggal harian
      totalTransaksi = await Penjualan.count({
        where: { tanggal_penjualan: { [Op.eq]: new Date(date) } },
      });
      totalPendapatan = await Penjualan.sum("total_harga", {
        where: { tanggal_penjualan: { [Op.eq]: new Date(date) } },
      });
    } else if (month && year) {
      // Filter berdasarkan bulan
      const startOfMonth = new Date(year, month - 1, 1);
      const endOfMonth = new Date(year, month, 0);

      totalTransaksi = await Penjualan.count({
        where: {
          tanggal_penjualan: { [Op.between]: [startOfMonth, endOfMonth] },
        },
      });
      totalPendapatan = await Penjualan.sum("total_harga", {
        where: {
          tanggal_penjualan: { [Op.between]: [startOfMonth, endOfMonth] },
        },
      });
    }

    res.json({ totalTransaksi, totalPendapatan });
  } catch (error) {
    res.status(500).json({ msg: "Error mengambil statistik" });
  }
};

