require("dotenv").config();
const Hapi = require("@hapi/hapi");

//kategori
const bengkel = require("./api/bengkel");
const BengkelService = require("./services/postgres/bengkelServices");
const BengkelValidator = require("./validator/bengkel");

const init = async () => {
  const bengkelServices = new BengkelService();
  const server = Hapi.server({
    port: 3000,
    host: "localhost",
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  await server.register([
    {
      plugin: bengkel,
      options: {
        service: bengkelServices,
        validator: BengkelValidator,
      },
    },
  ]);
  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};
init();
