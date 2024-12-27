const { Pool } = require("pg");
const xlsx = require("xlsx");
const notFoundError = require("../../exceptions/notFoundError");
const invariantError = require("../../exceptions/invariantError");

class SiswaService {
    constructor() {
        this._pool = new Pool();
    }

    async addSiswa({ nis, nama_siswa, jenis_kelamin, jurusan }) {
        const query = {
            text: "INSERT INTO siswa VALUES($1, $2, $3, $4) RETURNING nis",
            values: [nis, nama_siswa, jenis_kelamin, jurusan],
        };

        const result = await this._pool.query(query);
        if (!result.rows[0].nis) {
            throw new invariantError("Siswa gagal ditambahkan");
        }

        return result.rows[0].nis;
    }

    async getSiswa() {
        const result = await this._pool.query("SELECT * FROM siswa");
        return result.rows;
    }

    async editSiswaById(nis, { nama_siswa, jenis_kelamin, jurusan }) {
        const query = {
            text: "UPDATE siswa SET nama_siswa = $1, jenis_kelamin = $2, jurusan = $3 WHERE nis = $4 RETURNING nis",
            values: [nama_siswa, jenis_kelamin, jurusan, nis],
        };

        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new notFoundError("Gagal memperbarui data siswa. NIS tidak ditemukan");
        }
    }

    async deleteSiswaById(nis) {
        const query = {
            text: "DELETE FROM siswa WHERE nis = $1 RETURNING nis",
            values: [nis],
        };

        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new notFoundError("Siswa gagal dihapus. NIS tidak ditemukan");
        }
    }

    async importSiswaFromExcel(filePath) {
        // Baca file Excel
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0]; // Ambil sheet pertama
        const worksheet = workbook.Sheets[sheetName];

        // Ambil data dari rentang B3:E100
        const sheetData = xlsx.utils.sheet_to_json(worksheet, {
            range: "B3:E100",
            header: ["nis", "nama_siswa", "jenis_kelamin", "jurusan"], // Mapping header
            defval: null, // Isi default untuk cell kosong
        });

        // Iterasi setiap baris data dan tambahkan ke database
        for (const row of sheetData) {
            const { nis, nama_siswa, jenis_kelamin, jurusan } = row;

            // Validasi data wajib
            if (!nis || !nama_siswa || !jenis_kelamin || !jurusan) {
                console.error(`Data tidak valid: ${JSON.stringify(row)}`);
                continue; // Lewati data yang tidak valid
            }

            try {
                await this.addSiswa({ nis, nama_siswa, jenis_kelamin, jurusan });
            } catch (error) {
                console.error(`Gagal menambahkan siswa dengan NIS ${nis}: ${error.message}`);
            }
        }

        return { message: "Import data siswa berhasil" };
    }
}

module.exports = SiswaService;
