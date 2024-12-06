const routes = (handler) => [
    {
        method: "POST",
        path: "/alat-bermasalah",
        handler: handler.postAlatBermasalahHandler,
        options: {
            auth: 'loansapp_jwt',
        },
    },
    {
        method: "GET",
        path: "/alat-bermasalah",
        handler: handler.getAlatBermasalahHandler,
        options: {
            auth: 'loansapp_jwt',
        },
    },
];

module.exports = routes;
