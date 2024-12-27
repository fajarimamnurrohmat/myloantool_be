const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const xlsx = require("xlsx");
const notFoundError = require("../../exceptions/notFoundError");
const invariantError = require("../../exceptions/invariantError");

class alatService {
    constructor() {
        this._pool = new Pool();
    }

    async addAlat({ id_bengkel, nama_alat, jumlah }) {
        const id_alat = nanoid(16);
        const query = {
            text: "INSERT INTO alat VALUES($1, $2, $3, $4) RETURNING id_alat",
            values: [id_alat, id_bengkel, nama_alat, jumlah],
        };
        const result = await this._pool.query(query);

        if (!result.rows[0].id_alat) {
            throw new invariantError("Alat gagal ditambahkan");
        }

        return result.rows[0].id_alat;
    }

    async getAlat() {
        const query = `
            SELECT 
                alat.id_alat, 
                bengkel.ruang_bengkel,
                alat.nama_alat, 
                alat.jumlah
            FROM 
                alat
            JOIN 
                bengkel ON alat.id_bengkel = bengkel.id_bengkel
        `;
        const result = await this._pool.query(query);
        return result.rows;
    }    

    async editAlatById(id_alat, { id_bengkel, nama_alat, jumlah }) {
        const query = {
            text: "UPDATE alat SET id_bengkel = $1, nama_alat = $2, jumlah = $3 WHERE id_alat = $4 RETURNING id_alat",
            values: [id_bengkel, nama_alat, jumlah, id_alat],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new notFoundError("Gagal memperbarui alat. Id tidak ditemukan");
        }
    }

    async deleteAlatById(id_alat) {
        const query = {
            text: "DELETE FROM alat WHERE id_alat = $1 RETURNING id_alat",
            values: [id_alat],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new notFoundError("Alat gagal dihapus. Id tidak ditemukan");
        }
    }

    async importAlatFromExcel(filePath) {
        // Baca file Excel
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0]; // Ambil sheet pertama
        const worksheet = workbook.Sheets[sheetName];

        // Ambil data dari rentang A2:D100
        const sheetData = xlsx.utils.sheet_to_json(worksheet, {
            range: "A2:D100", // Rentang data
            header: ["id_bengkel", "nama_alat", "jumlah"], // Mapping header
            defval: null, // Nilai default untuk cell kosong
        });

        // Iterasi setiap baris data dan tambahkan ke database
        for (const row of sheetData) {
            const { id_bengkel, nama_alat, jumlah } = row;

            // Validasi data wajib
            if (!id_bengkel || !nama_alat || jumlah == null) {
                console.error(`Data tidak valid: ${JSON.stringify(row)}`);
                continue; // Lewati data yang tidak valid
            }

            try {
                await this.addAlat({ id_bengkel, nama_alat, jumlah });
            } catch (error) {
                console.error(
                    `Gagal menambahkan alat dengan nama ${nama_alat}: ${error.message}`
                );
            }
        }

        return { message: "Import data alat berhasil" };
    }
}

module.exports = alatService;
