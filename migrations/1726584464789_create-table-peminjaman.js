/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable('peminjaman', {
        id_peminjaman: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        nis: {
            type: 'VARCHAR(50)',
            notNull: true,
            references: '"siswa"(nis)',  // Foreign key dari tabel siswa kolom nis
            onDelete: 'CASCADE',
        },
        id_alat: {
            type: 'VARCHAR(50)',
            notNull: true,
            references: '"alat"(id_alat)',  // Foreign key dari tabel alat kolom id_alat
            onDelete: 'CASCADE',
        },
        jumlah: {
            type: 'INTEGER',
            notNull: true,
        },
        tanggal_pinjam: {
            type: 'DATE',
            notNull: true,
        },
    });
};

exports.down = (pgm) => {
    pgm.dropTable('peminjaman');
};
