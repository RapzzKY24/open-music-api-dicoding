class UsersHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postUsersHandler = this.postUsersHandler.bind(this);
    this.getUsersByIdHandler = this.getUsersByIdHandler.bind(this);
  }

  async postUsersHandler(req, h) {
    try {
      await this._validator.validateUserPayload(req.payload);
      const { username, fullname, password } = req.payload;
      const userId = await this._service.addUser({
        username,
        fullname,
        password,
      });

      const response = h.response({
        status: "success",
        message: "Berhasil menambahkan users",
        data: {
          userId,
        },
      });
      response.code(201);
      return response;
    } catch (err) {
      console.log(err);
      const response = h.response({
        status: "fail",
        message: err.message,
      });
      response.code(400);
      return response;
    }
  }

  async getUsersByIdHandler(req, h) {
    try {
      const { id } = req.params;
      const user = await this._service.getUserById(id);
      const response = h.response({
        status: "success",
        message: "berhasil mendapatkan user",
        data: {
          user,
        },
      });
      response.code(200);
      return response;
    } catch (err) {
      console.log(err);
      const response = h.response({
        status: "fail",
        message: err.message,
      });
      response.code(400);
      return response;
    }
  }
}

module.exports = UsersHandler;
