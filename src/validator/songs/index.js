const InvariantError = require("../../execptions/InvariantError");
const { songsPayloadSchema } = require("./schema");

const songValidator = {
  validateSongPayload: (payload) => {
    const validateResult = songsPayloadSchema.validate(payload);
    if (validateResult.error) {
      throw new InvariantError(validateResult.message.error);
    }
  },
};

module.exports = songValidator;
