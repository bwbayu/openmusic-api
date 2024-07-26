const AlbumsHandler = require('./handler');
const routes = require('./route');

module.exports = {
  name: 'albums',
  version: '1.0.0',
  register: async (server, {
    albumsService,
    songsService,
    storageService,
    validator,
    uploadValidator,
  }) => {
    const albumsHandler = new AlbumsHandler(
      albumsService,
      songsService,
      storageService,
      validator,
      uploadValidator,
    );
    server.route(routes(albumsHandler));
  },
};
