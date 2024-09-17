const Joi = require('joi');

const PeminjamanPayloadSchema = Joi.object({
    nis: Joi.string().required(),              
    id_alat: Joi.string().required(),          
    jumlah: Joi.number().integer().min(1).required(),  
    tanggal_pinjam: Joi.date().required(),     
});

module.exports = { PeminjamanPayloadSchema };
