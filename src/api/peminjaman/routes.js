const routes = (handler) => [
  {
    method: "POST",
    path: "/peminjaman",
    handler: handler.postPeminjamanHandler,
  },
  {
    method: "GET",
    path: "/peminjaman",
    handler: handler.getPeminjamanHandler,
  },
  {
    method: "PUT",
    path: "/peminjaman/{id_peminjaman}",
    handler: handler.putPeminjamanByIdHandler,
  },
  {
    method: "DELETE",
    path: "/peminjaman/{id_peminjaman}",
    handler: handler.deletePeminjamanByIdHandler,
  },
];

module.exports = routes;
