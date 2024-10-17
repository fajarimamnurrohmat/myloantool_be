const { options } = require("joi");

const routes = (handler) => [
    {
        method: "POST",
        path: "/bengkel",
        handler: handler.postBengkelHandler,
        options: {
            auth: 'loansapp_jwt',
        },
    },
    {
        method: "GET",
        path: "/bengkel",
        handler: handler.getBengkelHandler,
        options: {
            auth: 'loansapp_jwt',
        },
    },
    {
        method: "PUT",
        path: "/bengkel/{id_bengkel}",
        handler: handler.putBengkelByIdHandler,
        options: {
            auth: 'loansapp_jwt',
        },
    },
    {
        method: "DELETE",
        path: "/bengkel/{id_bengkel}",
        handler: handler.deleteBengkelByIdHandler,
        options: {
            auth: 'loansapp_jwt',
        },
    },
];
module.exports = routes;
