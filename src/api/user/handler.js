class UserHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        this.postUserHandler = this.postUserHandler.bind(this);
        this.getUsersHandler = this.getUsersHandler.bind(this);
        this.putUserByIdHandler = this.putUserByIdHandler.bind(this);
        this.deleteUserByIdHandler = this.deleteUserByIdHandler.bind(this);
    }

    // Menambahkan data user baru
    async postUserHandler(request, h) {
        try {
            this._validator.validateUserPayload(request.payload); // Validasi payload
            const { username, password } = request.payload; // Ambil data dari payload

            // Tambahkan user baru menggunakan service, id_user akan di-generate otomatis
            const userId = await this._service.addUser({ username, password });

            const response = h.response({
                status: 'success',
                message: 'User berhasil ditambahkan',
                data: { userId }, // Tampilkan id_user yang baru
            });
            response.code(201);
            return response;
        } catch (error) {
            const response = h.response({
                status: 'fail',
                message: error.message,
            });
            response.code(400);
            return response;
        }
    }

    // Mendapatkan semua data user
    async getUsersHandler() {
        const users = await this._service.getUsers();
        return {
            status: 'success',
            data: { users },
        };
    }

    // Memperbarui data user berdasarkan ID
    async putUserByIdHandler(request, h) {
        try {
            this._validator.validateUserPayload(request.payload); // Validasi payload
            const { id_user } = request.params; // Ambil id_user dari URL parameter
            const { username, password } = request.payload; // Ambil data baru dari payload

            // Perbarui user berdasarkan id_user
            await this._service.editUserById(id_user, { username, password });

            return {
                status: 'success',
                message: 'Data user berhasil diperbarui',
            };
        } catch (error) {
            const response = h.response({
                status: 'fail',
                message: error.message,
            });
            response.code(404);
            return response;
        }
    }

    // Menghapus data user berdasarkan ID
    async deleteUserByIdHandler(request, h) {
        try {
            const { id_user } = request.params; // Ambil id_user dari URL parameter
            await this._service.deleteUserById(id_user); // Hapus user berdasarkan id_user

            return {
                status: 'success',
                message: 'Data user berhasil dihapus',
            };
        } catch (error) {
            const response = h.response({
                status: 'fail',
                message: 'Data user gagal dihapus. ID user tidak ditemukan',
            });
            response.code(404);
            return response;
        }
    }
}

module.exports = UserHandler;
