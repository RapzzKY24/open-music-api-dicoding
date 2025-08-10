const { Pool } = require("pg");
const InvariantError = require("../../execptions/InvariantError");

class AuthenticationsService {
  constructor() {
    this._pool = new Pool();
  }

  async addRefreshToken(token) {
    const queryAddToken = {
      text: "INSERT INTO authentications VALUES($1)",
      values: [token],
    };
    await this._pool.query(queryAddToken);
  }

  async verifyRefreshToken(token) {
    const querySelectToken = {
      text: "SELECT token FROM authentications WHERE token=$1",
      values: [token],
    };
    const result = await this._pool.query(querySelectToken);
    if (!result.rows.length) {
      throw new InvariantError("Refresh token tidak valid");
    }
  }

  async deleteRefreshToken(token) {
    const queryDelete = {
      text: "DELETE from authentications WHERE token = $1",
      values: [token],
    };
    await this._pool.query(queryDelete);
  }
}

module.exports = AuthenticationsService;
