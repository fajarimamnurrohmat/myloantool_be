/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('alat', {
        id_alat: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        id_bengkel: {
            type: 'VARCHAR(50)',
            notNull: true,
            references: 'bengkel(id_bengkel)',
            onDelete: 'cascade', // Opsional, akan menghapus alat terkait jika bengkel dihapus
        },
        nama_alat: {
            type: 'VARCHAR(100)',
            notNull: true,
        },
        jumlah: {
            type: 'INTEGER',
            notNull: true,
        }
    });
};

exports.down = pgm => {
    pgm.dropTable('alat');
};
