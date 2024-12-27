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
    {
        method: "POST",
        path: "/siswa/import",
        handler: handler.importSiswaFromExcelHandler,
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
