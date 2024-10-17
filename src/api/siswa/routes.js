const routes = (handler) => [
    {
        method: "POST",
        path: "/siswa",
        handler: handler.postSiswaHandler,
        options: {
            auth: 'loansapp_jwt',
        },
    },
    {
        method: "GET",
        path: "/siswa",
        handler: handler.getSiswaHandler,
        options: {
            auth: 'loansapp_jwt',
        },
    },
    {
        method: "PUT",
        path: "/siswa/{nis}",
        handler: handler.putSiswaByIdHandler,
        options: {
            auth: 'loansapp_jwt',
        },
    },
    {
        method: "DELETE",
        path: "/siswa/{nis}",
        handler: handler.deleteSiswaByIdHandler,
        options: {
            auth: 'loansapp_jwt',
        },
    },
];

module.exports = routes;
