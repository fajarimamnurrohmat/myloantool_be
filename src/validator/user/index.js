// index.js
const { UserPayloadSchema } = require("./schema");
const InvariantError = require("../../exceptions/invariantError");

const UserValidator = {
    validateUserPayload: (payload) => {
        const validationResult = UserPayloadSchema.validate(payload);
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
};

module.exports = UserValidator;
