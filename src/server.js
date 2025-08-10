require("dotenv").config();
const Hapi = require("@hapi/hapi");
const JWT = require("@hapi/jwt");
const ClientError = require("./execptions/ClientError");

//albums
const albums = require("./api/albums");
const albumValidator = require("./validator/albums");
const AlbumsService = require("./services/albums/albums.service");

//songs
const songs = require("./api/songs");
const SongsService = require("./services/songs/songs.service");
const songValidator = require("./validator/songs");

//users
const users = require("./api/users");
const UsersService = require("./services/users/users.service");
const UsersValidator = require("./validator/users");

//authentications
const authentications = require("./api/authentications");
const AuthenticationsService = require("./services/authentications/authentications.service");
const AuthenticationValidator = require("./validator/authentications");
const TokenManager = require("./tokenize/TokenManager");

const init = async () => {
  const authenticationsService = new AuthenticationsService();
  const songsService = new SongsService();
  const albumsService = new AlbumsService();
  const usersService = new UsersService();

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
      plugin: JWT,
    },
  ]);

  server.auth.strategy("openmusics_jwt", "jwt", {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
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
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationValidator,
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
