const routes = (handler) => [
    {
        method: 'POST',
        path: '/pengembalian',
        handler: handler.postPengembalianHandler,
        // options: {
        //     auth: 'loansapp_jwt',
        // },
    },
    {
        method: 'GET',
        path: '/pengembalian',
        handler: handler.getPengembalianHandler,
        // options: {
        //     auth: 'loansapp_jwt',
        // },
    }
];

module.exports = routes;
