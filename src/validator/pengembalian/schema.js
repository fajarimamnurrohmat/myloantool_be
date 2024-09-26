const Joi = require('joi');

const PengembalianPayloadSchema = Joi.object({
    id_peminjaman: Joi.string().required(),  // FK mengacu ke id_peminjaman
    tgl_kembali: Joi.date().required(),      // Tanggal pengembalian
    jumlah: Joi.number().integer().required() // Jumlah alat yang dikembalikan
});

module.exports = { PengembalianPayloadSchema };
