const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { mapDBToModelAlbums } = require('../../utils/albums');
const ClientError = require('../../exceptions/ClientError');

class AlbumsService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addAlbum({ name, year }) {
    const id = `album-${nanoid(16)}`;
    const createdAt = new Date().toISOString();

    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3, $4, $4) RETURNING id',
      values: [id, name, year, createdAt],
    };
    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getAlbums() {
    const query = 'SELECT * FROM albums';
    const result = await this._pool.query(query);
    return result.rows.map(mapDBToModelAlbums);
  }

  async getAlbumById(id) {
    const query = {
      text: 'SELECT id, name, year, cover_url FROM albums WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    const data = {
      id: result.rows[0].id,
      name: result.rows[0].name,
      year: result.rows[0].year,
      coverUrl: result.rows[0].cover_url,
    };
    return data;
  }

  async editAlbumById(id, { name, year }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2, updated_at = $3 WHERE id = $4 RETURNING id',
      values: [name, year, updatedAt, id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
    }
  }

  async updateCovers(id, coverUrl) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE albums SET cover_url = $1, updated_at = $2 WHERE id = $3 RETURNING id',
      values: [coverUrl, updatedAt, id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Gagal memperbarui cover album. Id tidak ditemukan');
    }
  }

  async addLikeAlbums(albumId, userId) {
    const queryCheck = {
      text: 'SELECT id FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId],
    };

    const resultCheck = await this._pool.query(queryCheck);

    if (resultCheck.rowCount) {
      throw new ClientError('Album sudah disukai');
    }

    const id = `like-${nanoid(16)}`;
    const queryAdd = {
      text: 'INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id',
      values: [id, userId, albumId],
    };

    await this._pool.query(queryAdd);
    await this._cacheService.delete(`user_album_likes:${albumId}`);
  }

  async getLikeAlbums(albumId) {
    try {
      const likes = parseInt(await this._cacheService.get(`user_album_likes:${albumId}`), 10);
      return {
        likes,
        source: 'cache',
      };
    } catch (error) {
      const query = {
        text: 'SELECT * FROM user_album_likes WHERE album_id = $1',
        values: [albumId],
      };
      const result = await this._pool.query(query);
      const likes = result.rowCount;
      await this._cacheService.set(`user_album_likes:${albumId}`, likes);
      return {
        likes,
        source: 'server',
      };
    }
  }

  async deleteAlbumLike(albumId, userId) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE album_id = $1 AND user_id = $2 RETURNING id',
      values: [albumId, userId],
    };

    await this._pool.query(query);
    await this._cacheService.delete(`user_album_likes:${albumId}`);
  }
}

module.exports = AlbumsService;
