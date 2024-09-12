class AlatHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;
        this.postAlatHandler = this.postAlatHandler.bind(this);
        this.getAlatHandler = this.getAlatHandler.bind(this);
        this.putAlatByIdHandler = this.putAlatByIdHandler.bind(this);
        this.deleteAlatByIdHandler = this.deleteAlatByIdHandler.bind(this);
    }

    async postAlatHandler(request, h) {
        try {
            this._validator.validateAlatPayload(request.payload);
            const { id_bengkel, nama_alat, jumlah } = request.payload;
            const alatId = await this._service.addAlat({ id_bengkel, nama_alat, jumlah });
            const response = h.response({
                status: "success",
                message: "Alat berhasil ditambahkan",
                data: {
                    alatId,
                },
            });
            response.code(201);
            return response;
        } 
        catch (error) {
            const response = h.response({
                status: "fail",
                message: error.message,
            });
            response.code(400);
            return response;
        }
    }

    async getAlatHandler() {
        const alat = await this._service.getAlat();
        return {
            status: "success",
            data: {
                alat,
            },
        };
    }

    async putAlatByIdHandler(request, h) {
        try {
            this._validator.validateAlatPayload(request.payload);
            const { id_bengkel, nama_alat, jumlah } = request.payload;
            const { id_alat } = request.params;
            await this._service.editAlatById(id_alat, { id_bengkel, nama_alat, jumlah });
            return {
                status: "success",
                message: "Alat berhasil diperbarui",
            };
        } 
        catch (error) {
            const response = h.response({
                status: "fail",
                message: error.message,
            });
            response.code(404);
            return response;
        }
    }

    async deleteAlatByIdHandler(request, h) {
        try {
            const { id_alat } = request.params;
            await this._service.deleteAlatById(id_alat);
            return {
                status: "success",
                message: "Alat berhasil dihapus",
            };
        } 
        catch (error) {
            const response = h.response({
                status: "fail",
                message: "Alat gagal dihapus. Id tidak ditemukan",
            });
            response.code(404);
            return response;
        }
    }
}

module.exports = AlatHandler;
