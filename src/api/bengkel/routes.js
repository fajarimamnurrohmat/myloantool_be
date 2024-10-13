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
    {
        method: "POST",
        path: "/bengkel/upload",
        handler: handler.uploadBengkelHandler,
        options: {
            payload: {
                allow: 'multipart/form-data',
                output: 'stream',
                parse: true,
                multipart: true,
            }
        }
    }
];
module.exports = routes;
