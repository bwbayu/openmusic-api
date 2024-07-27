const autoBind = require('auto-bind');

class AlbumsHandler {
  constructor(albumsService, songsService, storageService, validator, uploadValidator) {
    this._albumsService = albumsService;
    this._songsService = songsService;
    this._storageService = storageService;
    this._validator = validator;
    this._uploadValidator = uploadValidator;

    autoBind(this);
  }

  async postAlbumHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const albumId = await this._albumsService.addAlbum(request.payload);

    const response = h.response({
      status: 'success',
      message: 'Album berhasil ditambahkan',
      data: {
        albumId,
      },
    });

    response.code(201);
    return response;
  }

  async getAlbumsHandler() {
    const albums = await this._albumsService.getAlbums();
    return {
      status: 'success',
      data: {
        albums,
      },
    };
  }

  async getAlbumByIdHandler(request) {
    const { id } = request.params;
    const album = await this._albumsService.getAlbumById(id);
    album.songs = await this._songsService.getSongByAlbumId(id);

    return {
      status: 'success',
      data: {
        album,
      },
    };
  }

  async putAlbumByIdHandler(request) {
    this._validator.validateAlbumPayload(request.payload);
    const { id } = request.params;

    await this._albumsService.editAlbumById(id, request.payload);

    return {
      status: 'success',
      message: 'Album berhasil diperbarui',
    };
  }

  async deleteAlbumByIdHandler(request) {
    const { id } = request.params;
    await this._albumsService.deleteAlbumById(id);

    return {
      status: 'success',
      message: 'Album berhasil dihapus',
    };
  }

  async postUploadImageHandler(request, h) {
    const { cover } = request.payload;
    const { id } = request.params;
    this._uploadValidator.validateImageHeaders(cover.hapi.headers);

    const filename = await this._storageService.writeFile(cover, cover.hapi);
    const coverUrl = `http://${process.env.HOST}:${process.env.PORT}/albums/file/images/${filename}`;

    await this._albumsService.updateCovers(id, coverUrl);

    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
    });
    response.code(201);
    return response;
  }

  async postLikesAlbumByIdHandler(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._albumsService.getAlbumById(id);
    await this._albumsService.addLikeAlbums(id, credentialId);

    const response = h.response({
      status: 'success',
      message: 'Album berhasil disukai',
    });
    response.code(201);
    return response;
  }

  async getLikesAlbumByIdHandler(request, h) {
    const { id } = request.params;
    const { likes, source } = await this._albumsService.getLikeAlbums(id);

    const response = h.response({
      status: 'success',
      data: {
        likes,
      },
    });

    response.header('X-Data-Source', source);
    return response;
  }

  async deleteLikesAlbumByIdHandler(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._albumsService.getAlbumById(id);
    await this._albumsService.deleteAlbumLike(id, credentialId);

    const response = h.response({
      status: 'success',
      message: 'Album batal disukai',
    });
    response.code(200);
    return response;
  }
}

module.exports = AlbumsHandler;
