const routes = (handler) => [
    {
        method: "POST",
        path: "/siswa",
        handler: handler.postSiswaHandler,
    },
    {
        method: "GET",
        path: "/siswa",
        handler: handler.getSiswaHandler,
    },
    {
        method: "PUT",
        path: "/siswa/{nis}",
        handler: handler.putSiswaByIdHandler,
    },
    {
        method: "DELETE",
        path: "/siswa/{nis}",
        handler: handler.deleteSiswaByIdHandler,
    },
];

module.exports = routes;
