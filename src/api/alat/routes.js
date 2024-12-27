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
        options: {
            auth: 'loansapp_jwt',
        },
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
    {
        method: "POST",
        path: "/alat/import",
        handler: handler.postImportAlatHandler,
        options: {
            //auth: 'loansapp_jwt',
            payload: {
                output: 'file', // Menggunakan stream untuk mengelola file besar
                parse: true, // Parsing form-data
                allow: 'multipart/form-data', // Pastikan hanya multipart/form-data yang diizinkan
                multipart: true,
                maxBytes: 1048576, // Ukuran maksimal file 1MB (jika perlu disesuaikan)
            },
        },
    } 
];

module.exports = routes;
