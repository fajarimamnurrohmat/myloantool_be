// schema.js
const Joi = require("joi");

const UserPayloadSchema = Joi.object({
    username: Joi.string().max(50).required(),
    password: Joi.string().min(8).required(),
});

module.exports = { UserPayloadSchema };
