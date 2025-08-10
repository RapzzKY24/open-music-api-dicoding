const { Pool } = require("pg");
const InvariantError = require("../../execptions/InvariantError");
const { nanoid } = require("nanoid");
const NotFoundError = require("../../execptions/NotFoundError");
const bcrypt = require("bcrypt");
const AuthenticationError = require("../../execptions/Authentication");

class UserService {
  constructor() {
    this._pool = new Pool();
    this.SALT_ROUND = 10;
  }

  async addUser({ username, fullname, password }) {
    await this.verifyUsername(username);
    const id = `user-${nanoid(16)}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const hashPassword = await bcrypt.hash(password, 10);

    const queryUser = {
      text: "INSERT INTO users VALUES ($1,$2,$3,$4,$5,$6) RETURNING id",
      values: [id, username, fullname, hashPassword, createdAt, updatedAt],
    };

    const result = await this._pool.query(queryUser);

    if (!result.rows.length) {
      throw new InvariantError("Gagal menambahkan users");
    }

    return result.rows[0].id;
  }

  async verifyUsername(username) {
    const queryUsername = {
      text: "SELECT username FROM users WHERE username = $1",
      values: [username],
    };
    const result = await this._pool.query(queryUsername);

    if (result.rows.length > 0) {
      throw new InvariantError("Username sudah digunakan");
    }
  }

  async verifyUserCredential(username, password) {
    const query = {
      text: "SELECT id,password FROM users WHERE username = $1",
      values: [username],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new AuthenticationError("Kredensial yang anda berikan salah");
    }

    const { id, password: hashPassword } = result.rows[0];

    const match = await bcrypt.compare(password, hashPassword);

    if (!match) {
      throw new AuthenticationError("Kredensial yang anda berikan salah");
    }
    return id;
  }

  async getUserById(id) {
    const queryUserId = {
      text: "SELECT id,username,fullname FROM users WHERE id=$1",
      values: [id],
    };
    const result = await this._pool.query(queryUserId);
    if (!result.rows.length) {
      throw new NotFoundError("User tidak ditemukan");
    }
    return result.rows[0];
  }
}

module.exports = UserService;
