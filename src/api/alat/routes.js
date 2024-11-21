const routes = (handler) => [
    {
        method: "POST",
        path: "/alat",
        handler: handler.postAlatHandler,
        options: {
            auth: 'loansapp_jwt',
        },
    },
    {
        method: "GET",
        path: "/alat",
        handler: handler.getAlatHandler,
        // options: {
        //     auth: 'loansapp_jwt',
        // },
    },
    {
        method: "PUT",
        path: "/alat/{id_alat}",
        handler: handler.putAlatByIdHandler,
        options: {
            auth: 'loansapp_jwt',
        },
    },
    {
        method: "DELETE",
        path: "/alat/{id_alat}",
        handler: handler.deleteAlatByIdHandler,
        options: {
            auth: 'loansapp_jwt',
        },
    },
];

module.exports = routes;
