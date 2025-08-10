const Joi = require("joi");

const postAuthenticationsPayload = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

const putAuthenticationsPayload = Joi.object({
  refreshToken: Joi.string().required(),
});

const deleteAuthenticationsPayload = Joi.object({
  refreshToken: Joi.string().required(),
});

module.exports = {
  postAuthenticationsPayload,
  putAuthenticationsPayload,
  deleteAuthenticationsPayload,
};
