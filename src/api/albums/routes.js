const routes = (handler) => [
  {
    method: "POST",
    path: "/albums",
    handler: handler.postAlbumHandler,
    options: {
      auth: "openmusics_jwt",
    },
  },
  {
    method: "GET",
    path: "/albums",
    handler: handler.getAlbumsHandler,
    options: {
      auth: "openmusics_jwt",
    },
  },
  {
    method: "GET",
    path: "/albums/{id}",
    handler: handler.getAlbumByIdHandler,
    options: {
      auth: "openmusics_jwt",
    },
  },
  {
    method: "PUT",
    path: "/albums/{id}",
    handler: handler.putAlbumByIdHandler,
    options: {
      auth: "openmusics_jwt",
    },
  },
  {
    method: "DELETE",
    path: "/albums/{id}",
    handler: handler.deleteAlbumByIdHandler,
    options: {
      auth: "openmusics_jwt",
    },
  },
];

module.exports = routes;
