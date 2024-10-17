const routes = (handler) => [
    {
        method: "POST",
        path: "/user",
        handler: handler.postUserHandler,
        options: {
            auth: 'loansapp_jwt',
        },
    },
    {
        method: "GET",
        path: "/user",
        handler: handler.getUsersHandler,
        options: {
            auth: 'loansapp_jwt',
        },
    },
    {
        method: "PUT",
        path: "/user/{id_user}",
        handler: handler.putUserByIdHandler,
        options: {
            auth: 'loansapp_jwt',
        },
    },
    {
        method: "DELETE",
        path: "/user/{id_user}",
        handler: handler.deleteUserByIdHandler,
        options: {
            auth: 'loansapp_jwt',
        },
    },
];

module.exports = routes;
