const InvariantError = require("../../execptions/InvariantError");
const usersPayloadSchema = require("./schema");

const UserValidator = {
  validateUserPayload: (payload) => {
    const validateResult = usersPayloadSchema.validate(payload);
    if (validateResult.error) {
      throw new InvariantError(validateResult.error.message);
    }
  },
};

module.exports = UserValidator;
