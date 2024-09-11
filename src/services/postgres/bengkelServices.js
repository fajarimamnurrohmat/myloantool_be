const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const notFoundError = require("../../exceptions/notFoundError");
const invariantError = require("../../exceptions/invariantError");

class bengkelService {
    constructor() {
        this._pool = new Pool();
    }

    async addBengkel({ ruang_bengkel }) {
        const id_bengkel = nanoid(16);
        const query = {
            text: "INSERT INTO bengkel VALUES($1, $2) RETURNING id_bengkel",
            values: [id_bengkel, ruang_bengkel],
        };
        const result = await this._pool.query(query);
        if (!result.rows[0].id_bengkel) {
            throw new invariantError("Ruang bengkel gagal ditambahkan");
        }
        return result.rows[0].id_bengkel;
    }

    async getBengkel() {
        const result = await this._pool.query("SELECT * FROM bengkel");
        return result;
    }

    async editBengkelById(id_bengkel, { ruang_bengkel }) {
        const query = {
            text: "UPDATE bengkel SET ruang_bengkel = $1 WHERE id_bengkel = $2 RETURNING id_bengkel",
            values: [ruang_bengkel, id_bengkel],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new notFoundError("Gagal memperbarui ruang bengkel. Id tidak ditemukan");
        }
    }

    async deleteBengkelById(id_bengkel) {
        const query = {
            text: "DELETE FROM bengkel WHERE id_bengkel = $1 RETURNING id_bengkel",
            values: [id_bengkel],
        };
        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new notFoundError("Ruang bengkel gagal dihapus. Id tidak ditemukan");
        }
    }
}
module.exports = bengkelService;