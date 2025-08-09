require("dotenv").config();
const Hapi = require("@hapi/hapi");
const ClientError = require("./execptions/ClientError");

//albums
const albums = require("./api/albums");
const albumValidator = require("./validator/albums");
const AlbumsService = require("./services/albums/albums.service");

//songs
const songs = require("./api/songs");
const SongsService = require("./services/songs/songs.service");
const songValidator = require("./validator/songs");

const init = async () => {
  const songsService = new SongsService();
  const albumsService = new AlbumsService();

  const server = Hapi.Server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  await server.register([
    {
      plugin: albums,
      options: {
        service: albumsService,
        validator: albumValidator,
      },
    },
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: songValidator,
      },
    },
  ]);

  server.ext("onPreResponse", (request, h) => {
    const { response } = request;

    if (response instanceof ClientError) {
      const newResponse = h.response({
        status: "fail",
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }
    return h.continue;
  });

  await server.start();
  console.log(`server running in ${server.info.uri}`);
};
init();
