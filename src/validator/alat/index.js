const { AlatPayloadSchema } = require("./schema");
const AlatValidator = {
    validateAlatPayload: (payload) => {
        const validationResult = AlatPayloadSchema.validate(payload);
        if (validationResult.error) {
            throw new Error(validationResult.error.message);
        }
    },
};
module.exports = AlatValidator;
