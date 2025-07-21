require("dotenv").config();
const Hapi = require("@hapi/hapi");
const ClientError = require("./execptions/ClientError");
const albums = require("./api/albums");

const albumValidator = require("./validator/albums");
const AlbumsService = require("./services/albums/albums.service");

const init = async () => {
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

  await server.register({
    plugin: albums,
    options: {
      service: albumsService,
      validator: albumValidator,
    },
  });

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
