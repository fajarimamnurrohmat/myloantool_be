class SiswaHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        this.postSiswaHandler = this.postSiswaHandler.bind(this);
        this.getSiswaHandler = this.getSiswaHandler.bind(this);
        this.putSiswaByIdHandler = this.putSiswaByIdHandler.bind(this);
        this.deleteSiswaByIdHandler = this.deleteSiswaByIdHandler.bind(this);
    }

    // Menambahkan data siswa baru
    async postSiswaHandler(request, h) {
        try {
            this._validator.validateSiswaPayload(request.payload);
            const { nis, nama_siswa, jenis_kelamin, jurusan } = request.payload;
            const siswaId = await this._service.addSiswa({ nis, nama_siswa, jenis_kelamin, jurusan });

            const response = h.response({
                status: 'success',
                message: 'Siswa berhasil ditambahkan',
                data: {
                    siswaId,
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

    // Mendapatkan semua data siswa
    async getSiswaHandler() {
        const siswa = await this._service.getSiswa();
        return {
            status: 'success',
            data: {
                siswa,
            },
        };
    }

    // Memperbarui data siswa berdasarkan NIS
    async putSiswaByIdHandler(request, h) {
        try {
            this._validator.validateSiswaPayload(request.payload);
            const { nis } = request.params;
            const { nama_siswa, jenis_kelamin, jurusan } = request.payload;

            await this._service.editSiswaById(nis, { nama_siswa, jenis_kelamin, jurusan });

            return {
                status: 'success',
                message: 'Data siswa berhasil diperbarui',
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

    // Menghapus data siswa berdasarkan NIS
    async deleteSiswaByIdHandler(request, h) {
        try {
            const { nis } = request.params;
            await this._service.deleteSiswaById(nis);
            return {
                status: 'success',
                message: 'Data siswa berhasil dihapus',
            };
        } catch (error) {
            const response = h.response({
                status: 'fail',
                message: 'Data siswa gagal dihapus. NIS tidak ditemukan',
            });
            response.code(404);
            return response;
        }
    }
}

module.exports = SiswaHandler;
