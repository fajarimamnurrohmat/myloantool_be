const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const notFoundError = require('../../exceptions/notFoundError');
const invariantError = require('../../exceptions/invariantError');

class PeminjamanService {
    constructor() {
        this._pool = new Pool();
    }

    // Menambah peminjaman baru dan mengurangi stok alat
    async addPeminjaman({ nis, id_alat, jumlah, tanggal_pinjam }) {
        const id_peminjaman = nanoid(16);

        // Cek stok alat
        const getAlatQuery = {
            text: 'SELECT jumlah FROM alat WHERE id_alat = $1',
            values: [id_alat],
        };
        const alatResult = await this._pool.query(getAlatQuery);

        if (!alatResult.rows.length) {
            throw new notFoundError('Alat tidak ditemukan');
        }

        const stokTersedia = alatResult.rows[0].jumlah;

        if (stokTersedia < jumlah) {
            throw new invariantError('Stok alat tidak mencukupi');
        }

        // Kurangi stok alat
        const updateAlatQuery = {
            text: 'UPDATE alat SET jumlah = jumlah - $1 WHERE id_alat = $2',
            values: [jumlah, id_alat],
        };
        await this._pool.query(updateAlatQuery);

        // Masukkan peminjaman ke database
        const insertPeminjamanQuery = {
            text: 'INSERT INTO peminjaman VALUES($1, $2, $3, $4, $5) RETURNING id_peminjaman',
            values: [id_peminjaman, nis, id_alat, jumlah, tanggal_pinjam],
        };

        const result = await this._pool.query(insertPeminjamanQuery);

        if (!result.rows[0].id_peminjaman) {
            throw new invariantError('Peminjaman gagal ditambahkan');
        }

        return result.rows[0].id_peminjaman;
    }

    // Mendapatkan semua data peminjaman
    async getPeminjaman() {
        const query = `
            SELECT 
                peminjaman.id_peminjaman,
                siswa.nama_siswa,
                alat.nama_alat,
                bengkel.ruang_bengkel,
                peminjaman.jumlah,
                peminjaman.tanggal_pinjam
            FROM peminjaman
            INNER JOIN siswa ON peminjaman.nis = siswa.nis
            INNER JOIN alat ON peminjaman.id_alat = alat.id_alat
            INNER JOIN bengkel ON alat.id_bengkel = bengkel.id_bengkel
            WHERE peminjaman.jumlah > 0
        `;
        const result = await this._pool.query(query);
        return result.rows;
    }

    // Mengedit peminjaman dan menyesuaikan stok alat
    async editPeminjamanById(id_peminjaman, { nis, id_alat, jumlah, tanggal_pinjam }) {
        // Dapatkan data peminjaman sebelumnya
        const getPeminjamanQuery = {
            text: 'SELECT id_alat, jumlah FROM peminjaman WHERE id_peminjaman = $1',
            values: [id_peminjaman],
        };
        const peminjamanResult = await this._pool.query(getPeminjamanQuery);

        if (!peminjamanResult.rows.length) {
            throw new notFoundError('Peminjaman tidak ditemukan');
        }

        const peminjamanLama = peminjamanResult.rows[0];
        const jumlahLama = peminjamanLama.jumlah;
        const idAlatLama = peminjamanLama.id_alat;

        if (id_alat === idAlatLama) {
            // Jika alat tidak berubah, hanya sesuaikan stok berdasarkan jumlah baru
            const getAlatQuery = {
                text: 'SELECT jumlah FROM alat WHERE id_alat = $1',
                values: [id_alat],
            };
            const alatResult = await this._pool.query(getAlatQuery);

            if (!alatResult.rows.length) {
                throw new notFoundError('Alat tidak ditemukan');
            }

            const stokTersedia = alatResult.rows[0].jumlah;
            const perubahanStok = jumlah - jumlahLama;

            if (stokTersedia < perubahanStok) {
                throw new invariantError('Stok alat tidak mencukupi');
            }

            // Update stok alat
            const updateAlatQuery = {
                text: 'UPDATE alat SET jumlah = jumlah - $1 WHERE id_alat = $2',
                values: [perubahanStok, id_alat],
            };
            await this._pool.query(updateAlatQuery);
        } else {
            // Jika alat berubah, kembalikan stok alat lama dan kurangi stok alat baru
            const updateAlatLamaQuery = {
                text: 'UPDATE alat SET jumlah = jumlah + $1 WHERE id_alat = $2',
                values: [jumlahLama, idAlatLama],
            };
            await this._pool.query(updateAlatLamaQuery);

            const getAlatBaruQuery = {
                text: 'SELECT jumlah FROM alat WHERE id_alat = $1',
                values: [id_alat],
            };
            const alatBaruResult = await this._pool.query(getAlatBaruQuery);

            if (!alatBaruResult.rows.length) {
                throw new notFoundError('Alat baru tidak ditemukan');
            }

            const stokTersediaBaru = alatBaruResult.rows[0].jumlah;

            if (stokTersediaBaru < jumlah) {
                throw new invariantError('Stok alat baru tidak mencukupi');
            }

            const updateAlatBaruQuery = {
                text: 'UPDATE alat SET jumlah = jumlah - $1 WHERE id_alat = $2',
                values: [jumlah, id_alat],
            };
            await this._pool.query(updateAlatBaruQuery);
        }

        // Update data peminjaman
        const updatePeminjamanQuery = {
            text: 'UPDATE peminjaman SET nis = $1, id_alat = $2, jumlah = $3, tanggal_pinjam = $4 WHERE id_peminjaman = $5 RETURNING id_peminjaman',
            values: [nis, id_alat, jumlah, tanggal_pinjam, id_peminjaman],
        };

        const result = await this._pool.query(updatePeminjamanQuery);

        if (!result.rows.length) {
            throw new notFoundError('Gagal memperbarui peminjaman. Id tidak ditemukan');
        }
    }

    // Menghapus peminjaman dan mengembalikan stok alat
    async deletePeminjamanById(id_peminjaman) {
        const client = await this._pool.connect();
    
        try {
            // Mulai transaksi
            await client.query('BEGIN');
    
            // Dapatkan data peminjaman sebelum mencoba menghapus
            const getPeminjamanQuery = {
                text: 'SELECT id_alat, jumlah FROM peminjaman WHERE id_peminjaman = $1',
                values: [id_peminjaman],
            };
            const peminjamanResult = await client.query(getPeminjamanQuery);
    
            if (!peminjamanResult.rows.length) {
                throw new notFoundError('Peminjaman tidak ditemukan');
            }
    
            const { id_alat, jumlah } = peminjamanResult.rows[0];
    
            // Coba hapus peminjaman
            const deletePeminjamanQuery = {
                text: 'DELETE FROM peminjaman WHERE id_peminjaman = $1 RETURNING id_peminjaman',
                values: [id_peminjaman],
            };
            const result = await client.query(deletePeminjamanQuery);
    
            // Jika penghapusan berhasil, tambahkan stok alat
            if (result.rows.length) {
                const updateAlatQuery = {
                    text: 'UPDATE alat SET jumlah = jumlah + $1 WHERE id_alat = $2',
                    values: [jumlah, id_alat],
                };
                await client.query(updateAlatQuery);
            } else {
                throw new notFoundError('Peminjaman gagal dihapus.terpengaruh aturan ON DELETE RESTRICT');
            }
    
            // Commit transaksi jika semua operasi berhasil
            await client.query('COMMIT');
        } catch (error) {
            // Rollback jika terjadi kesalahan
            await client.query('ROLLBACK');
            throw error;
        } finally {
            // Pastikan koneksi dilepaskan
            client.release();
        }
    }
    
}

module.exports = PeminjamanService;
