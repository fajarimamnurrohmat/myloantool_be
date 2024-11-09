const { Pool } = require("pg");
const { nanoid } = require("nanoid");
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
}

module.exports = alatService;
