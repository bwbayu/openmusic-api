const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const NotFoundError = require('../../exceptions/NotFoundError');
const InvariantError = require('../../exceptions/InvariantError');

class PlaylistSongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylistSongs(playlistId, songId) {
    const id = `playlist-songs-${nanoid(16)}`;

    const playlistQuery = {
      text: 'INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };

    await this._pool.query(playlistQuery);
  }

  async getPlaylistSongsById(playlistId) {
    const playlistQuery = {
      text: `SELECT playlists.id, playlists.name, users.username 
      FROM playlist_songs
      LEFT JOIN playlists ON playlist_id = playlists.id 
      LEFT JOIN users ON playlists.owner = users.id 
      WHERE playlist_id = $1`,
      values: [playlistId],
    };

    const playlistResult = await this._pool.query(playlistQuery);

    if (!playlistResult.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    const songQuery = {
      text: `SELECT songs.id, songs.title, songs.performer
      FROM playlist_songs
      LEFT JOIN songs ON songs.id = playlist_songs.song_id
      WHERE playlist_id = $1`,
      values: [playlistId],
    };

    const songResult = await this._pool.query(songQuery);
    const data = {
      id: playlistResult.rows[0].id,
      name: playlistResult.rows[0].name,
      username: playlistResult.rows[0].username,
      songs: songResult.rows,
    };
    return data;
  }

  async deletePlaylistSongsById(playlistId, songId) {
    const query = {
      text: `DELETE FROM playlist_songs
      WHERE playlist_id = $1 AND song_id = $2 RETURNING id`,
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Lagu pada playlist gagal dihapus, lagu dan/atau playlist tidak ditemukan');
    }
  }
}

exports.module = PlaylistSongsService;
