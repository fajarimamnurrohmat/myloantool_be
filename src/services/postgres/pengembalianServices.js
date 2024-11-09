const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const notFoundError = require('../../exceptions/notFoundError');
const invariantError = require('../../exceptions/invariantError');

class PengembalianService {
    constructor() {
        this._pool = new Pool();
    }

    async addPengembalian({ id_peminjaman, tgl_kembali, jumlah }) {
        const id_pengembalian = nanoid(16);
    
        // Insert pengembalian
        const queryPengembalian = {
            text: 'INSERT INTO pengembalian VALUES($1, $2, $3, $4) RETURNING id_pengembalian',
            values: [id_pengembalian, id_peminjaman, tgl_kembali, jumlah],
        };
        const result = await this._pool.query(queryPengembalian);
    
        if (!result.rows[0].id_pengembalian) {
            throw new invariantError('Pengembalian gagal ditambahkan');
        }
    
        // Ambil jumlah alat yang dipinjam dari tabel peminjaman
        const queryGetPeminjaman = {
            text: 'SELECT jumlah, id_alat FROM peminjaman WHERE id_peminjaman = $1',
            values: [id_peminjaman],
        };
        const peminjamanResult = await this._pool.query(queryGetPeminjaman);
    
        if (!peminjamanResult.rows.length) {
            throw new notFoundError('Peminjaman tidak ditemukan');
        }
    
        const { jumlah: jumlahDipinjam, id_alat } = peminjamanResult.rows[0];
    
        // Jika jumlah yang dikembalikan sama dengan jumlah yang dipinjam, hapus dari tabel peminjaman
        if (jumlah >= jumlahDipinjam) {
            const queryDeletePeminjaman = {
                text: 'DELETE FROM peminjaman WHERE id_peminjaman = $1',
                values: [id_peminjaman],
            };
            await this._pool.query(queryDeletePeminjaman);
        } else {
            // Jika hanya sebagian yang dikembalikan, update jumlah di tabel peminjaman
            const queryUpdatePeminjaman = {
                text: 'UPDATE peminjaman SET jumlah = jumlah - $1 WHERE id_peminjaman = $2',
                values: [jumlah, id_peminjaman],
            };
            await this._pool.query(queryUpdatePeminjaman);
        }
    
        // Update jumlah alat di tabel alat (menambah stok alat setelah dikembalikan)
        const queryUpdateAlat = {
            text: `UPDATE alat SET jumlah = jumlah + $1 WHERE id_alat = $2`,
            values: [jumlah, id_alat],
        };
        await this._pool.query(queryUpdateAlat);
    
        return result.rows[0].id_pengembalian;
    }
    
    async getPengembalian() {
        const query = `
            SELECT 
                pengembalian.id_pengembalian,
                peminjaman.id_peminjaman,
                siswa.nama_siswa,
                alat.nama_alat,
                bengkel.ruang_bengkel,
                pengembalian.jumlah,
                peminjaman.tanggal_pinjam,
                pengembalian.tgl_kembali
            FROM pengembalian
            INNER JOIN peminjaman ON pengembalian.id_peminjaman = peminjaman.id_peminjaman
            INNER JOIN siswa ON peminjaman.nis = siswa.nis
            INNER JOIN alat ON peminjaman.id_alat = alat.id_alat
            INNER JOIN bengkel ON alat.id_bengkel = bengkel.id_bengkel
        `;
        const result = await this._pool.query(query);
        return result.rows;
    }    
}

module.exports = PengembalianService;
