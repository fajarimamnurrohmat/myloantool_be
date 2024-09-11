const Joi = require("joi");
const BengkelPayloadSchema = Joi.object({
    ruang_bengkel: Joi.string().required(),
});
module.exports = { BengkelPayloadSchema};
