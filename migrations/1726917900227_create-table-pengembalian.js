/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable('pengembalian', {
        id_pengembalian: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        id_peminjaman: {
            type: 'VARCHAR(50)',
            notNull: true,
            references: '"peminjaman"(id_peminjaman)',
            onDelete: 'cascade', // Menghapus pengembalian jika peminjaman terkait dihapus
        },
        tgl_kembali: {
            type: 'DATE',
            notNull: true,
        },
        jumlah: {
            type: 'INTEGER',
            notNull: true,
        },
    });
};

exports.down = (pgm) => {
    pgm.dropTable('pengembalian');
};
