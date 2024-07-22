const { Pool } = require('pg');
const { nanoid } = require('nanoid');

class PlaylistSongsActivitiesService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylistSongsActivites(playlistId, songId, userId, action) {
    const id = `${nanoid(16)}`;
    const time = new Date().toISOString();

    const query = {
      text: 'INSERT INTO playlist_songs_activities VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, playlistId, songId, userId, action, time],
    };

    await this._pool.query(query);
  }

  async getPlaylistSongsActivites(playlistId) {
    const query = {
      text: `SELECT users.username, songs.title, playlist_songs_activities.action, playlist_songs_activities.time
      FROM playlist_songs_activities
      LEFT JOIN users ON users.id = playlist_songs_activities.user_id
      LEFT JOIN songs ON songs.id = playlist_songs_activities.song_id
      WHERE playlist_id = $1`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);
    const data = {
      playlistId,
      activities: result.rows,
    };
    return data;
  }
}

module.exports = PlaylistSongsActivitiesService;
