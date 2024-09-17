const { PeminjamanPayloadSchema } = require('./schema');
const invariantError = require('../../exceptions/invariantError');

const PeminjamanValidator = {
    validatePeminjamanPayload: (payload) => {
        const validationResult = PeminjamanPayloadSchema.validate(payload);
        if (validationResult.error) {
            throw new invariantError(validationResult.error.message);
        }
    },
};

module.exports = PeminjamanValidator;
