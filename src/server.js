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

// peminjaman
const peminjaman = require("./api/peminjaman");
const PeminjamanService = require("./services/postgres/peminjamanServices");
const PeminjamanValidator = require("./validator/peminjaman");

// pengembalian
const pengembalian = require("./api/pengembalian");
const PengembalianService = require("./services/postgres/pengembalianServices");
const PengembalianValidator = require("./validator/pengembalian");

// pengembalian
const alat_bermasalah = require("./api/alat_bermasalah");
const Alat_bermasalahService = require("./services/postgres/alat_bermasalahServices");
const Alat_bermasalahValidator = require("./validator/alat_bermasalah");

const init = async () => {
  const bengkelServices = new BengkelService();
  const alatServices = new AlatService();
  const siswaServices = new SiswaService();
  const peminjamanServices = new PeminjamanService();
  const pengembalianServices = new PengembalianService();
  const alat_bermasalahServices = new Alat_bermasalahService();

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
    {
      plugin: peminjaman,
      options: {
        service: peminjamanServices,
        validator: PeminjamanValidator,
      },
    },
    {
      plugin: pengembalian,
      options: {
        service: pengembalianServices,
        validator: PengembalianValidator,
      },
    },
    {
      plugin: alat_bermasalah,
      options: {
        service: alat_bermasalahServices,
        validator: Alat_bermasalahValidator,
      },
    },
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
