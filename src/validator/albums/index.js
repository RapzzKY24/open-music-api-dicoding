const InvariantError = require("../../execptions/InvariantError");
const { albumPayloadSchema } = require("./schema");

const albumValidator = {
  validateAlbumPayload: (payload) => {
    const validateResult = albumPayloadSchema.validate(payload);
    if (validateResult.error) {
      throw new InvariantError(validateResult.error.message);
    }
  },
};

module.exports = albumValidator;
