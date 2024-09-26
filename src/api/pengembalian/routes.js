const routes = (handler) => [
    {
        method: 'POST',
        path: '/pengembalian',
        handler: handler.postPengembalianHandler,
    },
    {
        method: 'GET',
        path: '/pengembalian',
        handler: handler.getPengembalianHandler,
    }
];

module.exports = routes;
