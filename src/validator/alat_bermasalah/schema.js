const Joi = require('joi');

const AlatBermasalahPayloadSchema = Joi.object({
    id_peminjaman: Joi.string().required(),         
    tgl_permasalahan: Joi.date().required(),        
    kondisi: Joi.string().valid('rusak', 'hilang').required(), 
    jumlah: Joi.number().integer().required(), 
});

module.exports = { AlatBermasalahPayloadSchema };
