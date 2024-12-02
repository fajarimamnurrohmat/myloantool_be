const routes = (handler) => [
  {
    method: "POST",
    path: "/peminjaman",
    handler: handler.postPeminjamanHandler,
    // options: {
    //   auth: "loansapp_jwt",
    // },
  },
  {
    method: "GET",
    path: "/peminjaman",
    handler: handler.getPeminjamanHandler,
    // options: {
    //   auth: "loansapp_jwt",
    // },
  },
  {
    method: "PUT",
    path: "/peminjaman/{id_peminjaman}",
    handler: handler.putPeminjamanByIdHandler,
    // options: {
    //   auth: "loansapp_jwt",
    // },
  },
  {
    method: "DELETE",
    path: "/peminjaman/{id_peminjaman}",
    handler: handler.deletePeminjamanByIdHandler,
    // options: {
    //   auth: "loansapp_jwt",
    // },
  },
];

module.exports = routes;
