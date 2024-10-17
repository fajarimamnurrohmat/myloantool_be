require("dotenv").config();
const Hapi = require("@hapi/hapi");
const Jwt = require("@hapi/jwt");

// user
const user = require("./api/user");
const UserService = require("./services/postgres/userServices");
const UserValidator = require("./validator/user");

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

//authentications
const authentications = require("./api/authentication");
const AuthenticationsService = require("./services/postgres/authenticationServices");
const AuthenticationsValidator = require("./validator/authentication");
const TokenManager = require("./tokenize/tokenManager");
const { verify } = require("jsonwebtoken");

const init = async () => {
  const authenticationsServices = new AuthenticationsService();
  const userServices = new UserService();
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

  //registrasi plugin eksternal
  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  //strategy authentikasi Jwt
  server.auth.strategy('loansapp_jwt', 'jwt', {
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
      plugin: authentications,
      options: {
        authenticationsServices,
        userServices,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: user,
      options: {
        service: userServices,
        validator: UserValidator,
      },
    },
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
