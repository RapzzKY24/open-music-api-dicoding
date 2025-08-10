const InvariantError = require("../../execptions/InvariantError");
const {
  postAuthenticationsPayload,
  putAuthenticationsPayload,
  deleteAuthenticationsPayload,
} = require("./schema");

const AuthenticationValidator = {
  validateAuthenticationPostPayload: (payload) => {
    const validateResult = postAuthenticationsPayload.validate(payload);
    if (validateResult.error) {
      throw new InvariantError(validateResult.error.message);
    }
  },

  validateAuthenticationPutPayload: (payload) => {
    const validateResult = putAuthenticationsPayload.validate(payload);
    if (validateResult.error) {
      throw new InvariantError(validateResult.error.message);
    }
  },

  validateAuthenticationDeletePayload: (payload) => {
    const validateResult = deleteAuthenticationsPayload.validate(payload);
    if (validateResult.error) {
      throw new InvariantError(validateResult.error.message);
    }
  },
};

module.exports = AuthenticationValidator;
