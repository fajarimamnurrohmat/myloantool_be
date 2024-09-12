const { SiswaPayloadSchema } = require("./schema");
const InvariantError = require("../../exceptions/invariantError");

const SiswaValidator = {
    validateSiswaPayload: (payload) => {
        const validationResult = SiswaPayloadSchema.validate(payload);
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
};

module.exports = SiswaValidator;
