class PengembalianHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        this.postPengembalianHandler = this.postPengembalianHandler.bind(this);
        this.getPengembalianHandler = this.getPengembalianHandler.bind(this);
    }

    async postPengembalianHandler(request, h) {
        try {
            // Validasi payload
            this._validator.validatePengembalianPayload(request.payload);

            const { id_peminjaman, tgl_kembali, jumlah } = request.payload;

            // Menambah pengembalian ke database
            const pengembalianId = await this._service.addPengembalian({ id_peminjaman, tgl_kembali, jumlah });

            const response = h.response({
                status: 'success',
                message: 'Pengembalian berhasil ditambahkan',
                data: {
                    pengembalianId,
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

    async getPengembalianHandler() {
        const pengembalian = await this._service.getPengembalian();
        return {
            status: 'success',
            data: {
                pengembalian,
            },
        };
    }
}

module.exports = PengembalianHandler;
