/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable('alat_bermasalah', {
        id_alat_bermasalah: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        id_peminjaman: {
            type: 'VARCHAR(50)',
            notNull: true,
            references: '"peminjaman"(id_peminjaman)',
            onDelete: 'CASCADE',
        },
        tgl_permasalahan: {
            type: 'DATE',
            notNull: true,
        },
        kondisi: {
            type: 'TEXT',
            notNull: true,
        },
        jumlah: {
            type: 'INTEGER',
            notNull: true,
        },
    });
};

exports.down = (pgm) => {
    pgm.dropTable('alat_bermasalah');
};
