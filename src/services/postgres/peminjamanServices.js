const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const notFoundError = require('../../exceptions/notFoundError');
const invariantError = require('../../exceptions/invariantError');

class PeminjamanService {
    constructor() {
        this._pool = new Pool();
    }

    async addPeminjaman({ nis, id_alat, jumlah, tanggal_pinjam }) {
        const id_peminjaman = nanoid(16);
        const query = {
            text: 'INSERT INTO peminjaman VALUES($1, $2, $3, $4, $5) RETURNING id_peminjaman',
            values: [id_peminjaman, nis, id_alat, jumlah, tanggal_pinjam],
        };

        const result = await this._pool.query(query);

        if (!result.rows[0].id_peminjaman) {
            throw new invariantError('Peminjaman gagal ditambahkan');
        }

        return result.rows[0].id_peminjaman;
    }

    async getPeminjaman() {
        const query = `
            SELECT 
                peminjaman.id_peminjaman,
                siswa.nama_siswa,
                alat.nama_alat,
                peminjaman.jumlah,
                peminjaman.tanggal_pinjam
            FROM peminjaman
            INNER JOIN siswa ON peminjaman.nis = siswa.nis
            INNER JOIN alat ON peminjaman.id_alat = alat.id_alat
        `;
        const result = await this._pool.query(query);
        return result.rows;
    }

    async editPeminjamanById(id_peminjaman, { nis, id_alat, jumlah, tanggal_pinjam }) {
        const query = {
            text: 'UPDATE peminjaman SET nis = $1, id_alat = $2, jumlah = $3, tanggal_pinjam = $4 WHERE id_peminjaman = $5 RETURNING id_peminjaman',
            values: [nis, id_alat, jumlah, tanggal_pinjam, id_peminjaman],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new notFoundError('Gagal memperbarui peminjaman. Id tidak ditemukan');
        }
    }

    async deletePeminjamanById(id_peminjaman) {
        const query = {
            text: 'DELETE FROM peminjaman WHERE id_peminjaman = $1 RETURNING id_peminjaman',
            values: [id_peminjaman],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new notFoundError('Peminjaman gagal dihapus. Id tidak ditemukan');
        }
    }
}

module.exports = PeminjamanService;
