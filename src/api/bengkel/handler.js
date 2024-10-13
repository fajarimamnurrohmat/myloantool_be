const fs = require("fs");
const fastcsv = require("fast-csv");

class BengkelHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;
        this.postBengkelHandler = this.postBengkelHandler.bind(this);
        this.getBengkelHandler = this.getBengkelHandler.bind(this);
        this.putBengkelByIdHandler = this.putBengkelByIdHandler.bind(this);
        this.deleteBengkelByIdHandler = this.deleteBengkelByIdHandler.bind(this);
        this.uploadBengkelHandler = this.uploadBengkelHandler.bind(this);
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
    async uploadBengkelHandler(request, h) {
        const { file } = request.payload; // Ensure 'file' matches the key used in Postman

        // Check if the file was uploaded
        if (!file) {
            return h.response({ status: 'fail', message: 'File is required' }).code(400);
        }

        try {
            const csvData = [];
            const stream = fs.createReadStream(file.hapi.path); // Use the correct file path

            const csvStream = fastcsv
                .parse({ headers: true }) // Parse the CSV and use the first row as headers
                .on("data", (data) => {
                    // Each data object will have keys based on the headers
                    csvData.push(data);
                })
                .on("end", async () => {
                    // Here csvData will be an array of objects
                    // e.g., [{ ruang_bengkel: "IT 1" }, { ruang_bengkel: "IT 3" }, ...]

                    // Insert each entry into the database
                    const insertPromises = csvData.map(async (row) => {
                        const { ruang_bengkel } = row; // Extract the 'ruang_bengkel' value
                        // Call your service method to insert data into the database
                        await this._service.addBengkel({ ruang_bengkel });
                    });

                    // Wait for all insertions to complete
                    await Promise.all(insertPromises);

                    // Respond with success message
                    return h.response({
                        status: 'success',
                        message: 'File uploaded and data processed successfully',
                    }).code(200);
                });

            stream.pipe(csvStream);
            
        } catch (error) {
            console.error(error); // Log the error for debugging
            return h.response({ status: 'fail', message: error.message }).code(500);
        }
    }
}

module.exports = BengkelHandler;