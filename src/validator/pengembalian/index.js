const { PengembalianPayloadSchema } = require('./schema');
const InvariantError = require("../../exceptions/invariantError");

const PengembalianValidator = {
    validatePengembalianPayload: (payload) => {
        const validationResult = PengembalianPayloadSchema.validate(payload);
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
};

module.exports = PengembalianValidator;
