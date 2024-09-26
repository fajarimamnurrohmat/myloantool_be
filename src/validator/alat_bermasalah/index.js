const { AlatBermasalahPayloadSchema } = require('./schema');
const InvariantError = require("../../exceptions/invariantError");

const AlatBermasalahValidator = {
    validateAlatBermasalahPayload: (payload) => {
        const validationResult = AlatBermasalahPayloadSchema.validate(payload);
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
};

module.exports = AlatBermasalahValidator;
