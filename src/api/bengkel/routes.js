const routes = (handler) => [
    {
        method: "POST",
        path: "/bengkel",
        handler: handler.postBengkelHandler,
    },
    {
        method: "GET",
        path: "/bengkel",
        handler: handler.getBengkelHandler,
    },
    {
        method: "PUT",
        path: "/bengkel/{id_bengkel}",
        handler: handler.putBengkelByIdHandler,
    },
    {
        method: "DELETE",
        path: "/bengkel/{id_bengkel}",
        handler: handler.deleteBengkelByIdHandler,
    },
];
module.exports = routes;
