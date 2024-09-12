require("dotenv").config();
const Hapi = require("@hapi/hapi");

// kategori
const bengkel = require("./api/bengkel");
const BengkelService = require("./services/postgres/bengkelServices");
const BengkelValidator = require("./validator/bengkel");

// alat
const alat = require("./api/alat");
const AlatService = require("./services/postgres/alatServices");
const AlatValidator = require("./validator/alat");

// siswa
const siswa = require("./api/siswa");
const SiswaService = require("./services/postgres/siswaServices");
const SiswaValidator = require("./validator/siswa");

const init = async () => {
  const bengkelServices = new BengkelService();
  const alatServices = new AlatService();
  const siswaServices = new SiswaService();

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
    {
      plugin: alat,
      options: {
        service: alatServices,
        validator: AlatValidator,
      },
    },
    {
      plugin: siswa,
      options: {
        service: siswaServices,
        validator: SiswaValidator,
      },
    },
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
