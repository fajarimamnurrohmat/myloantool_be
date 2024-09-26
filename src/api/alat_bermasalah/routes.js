const routes = (handler) => [
    {
        method: "POST",
        path: "/alat-bermasalah",
        handler: handler.postAlatBermasalahHandler,
    },
    {
        method: "GET",
        path: "/alat-bermasalah",
        handler: handler.getAlatBermasalahHandler,
    },
];

module.exports = routes;
