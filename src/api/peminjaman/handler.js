class PeminjamanHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        this.postPeminjamanHandler = this.postPeminjamanHandler.bind(this);
        this.getPeminjamanHandler = this.getPeminjamanHandler.bind(this);
        this.putPeminjamanByIdHandler = this.putPeminjamanByIdHandler.bind(this);
        this.deletePeminjamanByIdHandler = this.deletePeminjamanByIdHandler.bind(this);
    }

    // Handler untuk menambahkan data peminjaman
    async postPeminjamanHandler(request, h) {
        try {
            // Validasi payload menggunakan validator
            this._validator.validatePeminjamanPayload(request.payload);
            
            // Ambil data dari payload
            const { nis, id_alat, jumlah, tanggal_pinjam } = request.payload;
            
            // Panggil service untuk menambahkan data
            const peminjamanId = await this._service.addPeminjaman({
                nis,
                id_alat,
                jumlah,
                tanggal_pinjam
            });

            const response = h.response({
                status: 'success',
                message: 'Peminjaman berhasil ditambahkan',
                data: {
                    peminjamanId,
                },
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

    // Handler untuk mendapatkan semua data peminjaman
    async getPeminjamanHandler() {
        const peminjaman = await this._service.getPeminjaman();
        return {
            status: 'success',
            data: {
                peminjaman,
            },
        };
    }

    // Handler untuk memperbarui data peminjaman berdasarkan ID
    async putPeminjamanByIdHandler(request, h) {
        try {
            this._validator.validatePeminjamanPayload(request.payload);
            const { nis, id_alat, jumlah, tanggal_pinjam } = request.payload;
            const { id_peminjaman } = request.params;

            await this._service.editPeminjamanById(id_peminjaman, { nis, id_alat, jumlah, tanggal_pinjam });

            return {
                status: 'success',
                message: 'Peminjaman berhasil diperbarui',
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

    // Handler untuk menghapus data peminjaman berdasarkan ID
    async deletePeminjamanByIdHandler(request, h) {
        try {
            const { id_peminjaman } = request.params;
            await this._service.deletePeminjamanById(id_peminjaman);
            return {
                status: 'success',
                message: 'Peminjaman berhasil dihapus',
            };
        } catch (error) {
            const response = h.response({
                status: 'fail',
                message: 'Peminjaman gagal dihapus. Id tidak ditemukan',
            });
            response.code(404);
            return response;
        }
    }
}

module.exports = PeminjamanHandler;
