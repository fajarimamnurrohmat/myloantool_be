const routes = (handler) => [
    {
        method: "POST",
        path: "/alat",
        handler: handler.postAlatHandler,
    },
    {
        method: "GET",
        path: "/alat",
        handler: handler.getAlatHandler,
    },
    {
        method: "PUT",
        path: "/alat/{id_alat}",
        handler: handler.putAlatByIdHandler,
    },
    {
        method: "DELETE",
        path: "/alat/{id_alat}",
        handler: handler.deleteAlatByIdHandler,
    },
];

module.exports = routes;
