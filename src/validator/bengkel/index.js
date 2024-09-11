const { BengkelPayloadSchema } = require("./schema");
const BengkelValidator = {
    validateBengkelPayload: (payload) => {
        const validationResult = BengkelPayloadSchema.validate(payload);
        if (validationResult.error) {
            throw new Error(validationResult.error.message);
        }
    },
};
module.exports = BengkelValidator;
