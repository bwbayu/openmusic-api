const AlbumsHandler = require('./handler');
const routes = require('./route');

module.exports = {
  name: 'albums',
  version: '1.0.0',
  register: async (server, { albumsService, songsService, validator }) => {
    const albumsHandler = new AlbumsHandler(albumsService, songsService, validator);
    server.route(routes(albumsHandler));
  },
};
