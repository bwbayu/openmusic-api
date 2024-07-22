const autoBind = require('auto-bind');

class PlaylistsHandler {
  constructor(
    playlistsService,
    playlistSongsService,
    playlistSongsActivitiesService,
    validator,
  ) {
    this._playlistsService = playlistsService;
    this._playlistSongsService = playlistSongsService;
    this._playlistSongsActivitiesService = playlistSongsActivitiesService;
    this._validator = validator;

    autoBind(this);
  }

  async postPlaylistHandler(request, h) {
    this._validator.validatePlaylistsPayload(request.payload);
    const { name } = request.payload;
    const { id: credentialId } = request.auth.credentials;
    const playlistId = await this._playlistsService.addPlaylist({
      name, owner: credentialId,
    });

    const response = h.response({
      status: 'success',
      message: 'Playlist berhasil ditambahkan',
      data: {
        playlistId,
      },
    });
    response.code(201);
    return response;
  }

  async getPlaylistsHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const playlists = await this._playlistsService.getPlaylists(credentialId);
    return {
      status: 'success',
      data: {
        playlists,
      },
    };
  }

  async deletePlaylistByIdHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistOwner(id, credentialId);
    await this._playlistsService.deletePlaylistsById(id);
    return {
      status: 'success',
      message: 'Playlist berhasil dihapus',
    };
  }

  async postPlaylistSongsHandler(request, h) {
    this._validator.validatePlaylistSongsPayload(request.payload);
    const { songId } = request.payload;
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
    await this._playlistSongsService.addPlaylistSongs(playlistId, songId);
    await this._playlistSongsActivitiesService.addPlaylistSongsActivites(
      playlistId,
      songId,
      credentialId,
      'add',
    );

    const response = h.response({
      status: 'success',
      message: 'Playlist berhasil ditambahkan',
      data: {
        playlistId,
      },
    });
    response.code(201);
    return response;
  }

  async getPlaylistSongsByIdHandler(request) {
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
    const playlist = await this._playlistSongsService.getPlaylistSongsById(playlistId);
    return {
      status: 'success',
      data: {
        playlist,
      },
    };
  }

  async deletePlaylistSongsByIdHandler(request) {
    const { songId } = request.payload;
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
    await this._playlistSongsService.deletePlaylistSongsById(playlistId, songId);
    await this._playlistSongsActivitiesService.addPlaylistSongsActivites(
      playlistId,
      songId,
      credentialId,
      'delete',
    );
    return {
      status: 'success',
      message: 'Playlist lagu berhasil dihapus',
    };
  }

  async getPlaylistSongsActivitiesByIdHandler(request) {
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
    const data = await this._playlistSongsActivitiesService.getPlaylistSongsActivites(playlistId);
    return {
      status: 'success',
      data,
    };
  }
}

module.exports = PlaylistsHandler;
