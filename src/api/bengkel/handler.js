class BengkelHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;
        this.postBengkelHandler = this.postBengkelHandler.bind(this);
        this.getBengkelHandler = this.getBengkelHandler.bind(this);
        this.putBengkelByIdHandler = this.putBengkelByIdHandler.bind(this);
        this.deleteBengkelByIdHandler = this.deleteBengkelByIdHandler.bind(this);
    }
    async postBengkelHandler(request, h) {
        try {
            this._validator.validateBengkelPayload(request.payload);
            const { ruang_bengkel } = request.payload;
            const bengkelId = await this._service.addBengkel({ ruang_bengkel });
            const response = h.response({
                status: "success",
                message: "Ruang bengkel berhasil ditambahkan",
                data: {
                    bengkelId,
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
    async getBengkelHandler() {
        const bengkel = await this._service.getBengkel();
        return {
            status: "success",
            data: {
                bengkel,
            },
        };
    }
    async putBengkelByIdHandler(request, h) {
        try {
            this._validator.validateBengkelPayload(request.payload);
            const { ruang_bengkel } = request.payload;
            const { id_bengkel } = request.params;
            await this._service.editBengkelById(id_bengkel, { ruang_bengkel });
            return {
                status: "success",
                message: "Ruang bengkel berhasil diperbarui",
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
    async deleteBengkelByIdHandler(request, h) {
        try {
            const { id_bengkel } = request.params;
            await this._service.deleteBengkelById(id_bengkel);
            return {
                status: "success",
                message: "Ruang bengkel berhasil dihapus",
            };
        } 
        catch (error) {
            const response = h.response({
                status: "fail",
                message: "Ruang bengkel gagal dihapus. Id tidak ditemukan",
            });
            response.code(404);
            return response;
        }
    }
}

module.exports = BengkelHandler;