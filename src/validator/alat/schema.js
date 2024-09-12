const Joi = require("joi");
const AlatPayloadSchema = Joi.object({
    id_bengkel: Joi.string().required(),
    nama_alat: Joi.string().required(),
    jumlah: Joi.number().integer().min(1).required(),
});

module.exports = { AlatPayloadSchema };
