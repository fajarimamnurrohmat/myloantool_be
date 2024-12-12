const InvariantError = require('../../exceptions/invariantError');

class AlatBermasalahHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        this.postAlatBermasalahHandler = this.postAlatBermasalahHandler.bind(this);
        this.getAlatBermasalahHandler = this.getAlatBermasalahHandler.bind(this);
        this.postPengembalianAlatBermasalahHandler = this.postPengembalianAlatBermasalahHandler.bind(this);
    }

    async postAlatBermasalahHandler(request, h) {
        try {
            this._validator.validateAlatBermasalahPayload(request.payload);
            const { id_peminjaman, tgl_permasalahan, kondisi, jumlah } = request.payload;

            const id_alat_bermasalah = await this._service.addAlatBermasalah({
                id_peminjaman,
                tgl_permasalahan,
                kondisi,
                jumlah,
            });

            const response = h.response({
                status: 'success',
                message: 'Alat bermasalah berhasil ditambahkan',
                data: {
                    id_alat_bermasalah,
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

    async getAlatBermasalahHandler() {
        const alatBermasalah = await this._service.getAlatBermasalah();
        return {
            status: 'success',
            data: {
                alatBermasalah,
            },
        };
    }

    async postPengembalianAlatBermasalahHandler(request, h) {
        try {
            const { id_alat_bermasalah } = request.params;
            const { id_peminjaman, tgl_kembali, jumlah } = request.payload;
    
            //this._validator.validatePengembalianAlatPayload(request.payload);
    
            const id_pengembalian = await this._service.addPengembalianAlatBermasalah({
                id_peminjaman,
                tgl_kembali,
                jumlah,
                id_alat_bermasalah,
            });
    
            const response = h.response({
                status: 'success',
                message: 'Pengembalian alat bermasalah berhasil ditambahkan',
                data: {
                    id_pengembalian,
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
}

module.exports = AlatBermasalahHandler;
