const ClientError = require("./ClientError");

class NotFoundError extends ClientError {
  constructor(message) {
    super(message, 400);
    this.name = "NotFound";
  }
}

module.exports = NotFoundError;
