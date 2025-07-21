const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../../execptions/InvariantError");
const NotFoundError = require("../../execptions/NotFoundError");
const { mapDbModelSongs } = require("../../utils");

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({
    title,
    year,
    genre,
    performer,
    duration = null,
    albumId = null,
  }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: "INSERT INTO songs values($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id",
      values: [
        id,
        title,
        year,
        genre,
        performer,
        duration,
        albumId,
        createdAt,
        updatedAt,
      ],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError("Gagal menambahkan music");
    }

    return result.rows[0].id;
  }

  async getSongs() {
    const result = await this._pool.query("SELECT * FROM songs");
    return result.rows;
  }

  async getSongById(id) {
    const query = {
      text: "SELECT * FROM songs where id=$1",
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Music dengan id tersebut tidak ditemukan");
    }

    return result.rows.map(mapDbModelSongs)[0];
  }

  async editSongById(
    id,
    { title, year, genre, performer, duration = null, albumId = null }
  ) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: `
      UPDATE songs 
      SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, albumId = $6, updated_at = $7 
      WHERE id = $8 
      RETURNING id
    `,
      values: [title, year, genre, performer, duration, albumId, updatedAt, id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("Gagal mengupdate music, id tidak tersedia");
    }
  }

  async deleteSongById(id) {
    const query = {
      text: "DELETE FROM songs where id=$1 RETURNING id",
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Gagal menghapus music,id tidak tersedia");
    }
  }
}

module.exports = SongsService;
