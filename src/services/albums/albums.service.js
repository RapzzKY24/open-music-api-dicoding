const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../../execptions/InvariantError");
const { mapDbModelAlbums } = require("../../utils");
const NotFoundError = require("../../execptions/NotFoundError");

class AlbumsService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum({ name, year }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: "INSERT INTO albums VALUES($1,$2,$3,$4,$5) RETURNING id",
      values: [id, name, year, createdAt, updatedAt],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError("Gagal menambahkan album");
    }

    return result.rows[0].id;
  }

  async getAlbums() {
    const result = await this._pool.query("SELECT * from albums");
    return result.rows.map(mapDbModelAlbums);
  }

  async getAlbumById(id) {
    const query = {
      text: "SELECT * FROM albums WHERE id=$1",
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Album tidak tersedia");
    }
    return result.rows.map(mapDbModelAlbums)[0];
  }

  async editAlbumById(id, { name, year }) {
    const updatedAt = new Date().toISOString();

    const query = {
      text: "UPDATE albums set name = $1,year = $2,updated_at = $3 WHERE id = $4 RETURNING id",
      values: [name, year, updatedAt, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Gagal mengupdate album,id tidak tersedia");
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: "DELETE FROM albums where id = $1 RETURNING id",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Gagal menghapus albums,id tidak tersedia");
    }
  }
}

module.exports = AlbumsService;
