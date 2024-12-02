/* eslint-disable camelcase */

const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const notFoundError = require('../../exceptions/notFoundError');
const invariantError = require('../../exceptions/invariantError');

class AlatBermasalahService {
    constructor() {
        this._pool = new Pool();
    }

    async addAlatBermasalah({ id_peminjaman, tgl_permasalahan, kondisi, jumlah }) {
        const id_alat_bermasalah = nanoid(16);
    
        // Ambil jumlah alat yang dipinjam dari tabel peminjaman
        const queryGetPeminjaman = {
            text: 'SELECT jumlah FROM peminjaman WHERE id_peminjaman = $1',
            values: [id_peminjaman],
        };
        const peminjamanResult = await this._pool.query(queryGetPeminjaman);
    
        if (!peminjamanResult.rows.length) {
            throw new notFoundError('Peminjaman tidak ditemukan');
        }
    
        const { jumlah: jumlahDipinjam } = peminjamanResult.rows[0];

    
        // Validasi jumlah alat bermasalah
        if (jumlah > jumlahDipinjam) {
            throw new invariantError('Jumlah alat bermasalah melebihi jumlah alat yang dipinjam');
        }
    
        // Insert alat bermasalah
        const queryAlatBermasalah = {
            text: 'INSERT INTO alat_bermasalah (id_alat_bermasalah, id_peminjaman, tgl_permasalahan, kondisi, jumlah) VALUES($1, $2, $3, $4, $5) RETURNING id_alat_bermasalah',
            values: [id_alat_bermasalah, id_peminjaman, tgl_permasalahan, kondisi, jumlah],
        };
        const result = await this._pool.query(queryAlatBermasalah);
    
        if (!result.rows[0].id_alat_bermasalah) {
            throw new invariantError('Alat bermasalah gagal ditambahkan');
        }
    
        // Update jumlah di tabel peminjaman
        const queryUpdatePeminjaman = {
            text: 'UPDATE peminjaman SET jumlah = jumlah - $1 WHERE id_peminjaman = $2',
            values: [jumlah, id_peminjaman],
        };
        await this._pool.query(queryUpdatePeminjaman);
    
        return result.rows[0].id_alat_bermasalah;
    }    

    async getAlatBermasalah() {
        const query = `
            SELECT 
                alat_bermasalah.id_alat_bermasalah,
                peminjaman.id_peminjaman,
                siswa.nama_siswa,
                alat.nama_alat,
                bengkel.ruang_bengkel,
                alat_bermasalah.jumlah,
                peminjaman.tanggal_pinjam,
                alat_bermasalah.tgl_permasalahan,
                alat_bermasalah.kondisi
            FROM alat_bermasalah
            INNER JOIN peminjaman ON alat_bermasalah.id_peminjaman = peminjaman.id_peminjaman
            INNER JOIN siswa ON peminjaman.nis = siswa.nis
            INNER JOIN alat ON peminjaman.id_alat = alat.id_alat
            INNER JOIN bengkel ON alat.id_bengkel = bengkel.id_bengkel
        `;
        const result = await this._pool.query(query);
        return result.rows;
    }
}

module.exports = AlatBermasalahService;
