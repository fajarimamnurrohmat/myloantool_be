const Joi = require("joi");

const SiswaPayloadSchema = Joi.object({
    nis: Joi.string().max(20).required(),
    nama_siswa: Joi.string().max(100).required(),
    jenis_kelamin: Joi.string().valid("Laki-laki", "Perempuan").required(),
    jurusan: Joi.string().max(50).required(),
});

module.exports = { SiswaPayloadSchema };
