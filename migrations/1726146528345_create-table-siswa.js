/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('siswa', {
        nis: {
            type: 'VARCHAR(20)',
            primaryKey: true,
        },
        nama_siswa: {
            type: 'VARCHAR(100)',
            notNull: true,
        },
        jenis_kelamin: {
            type: 'VARCHAR(15)',
            notNull: true,
        },
        jurusan: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
    });
};

exports.down = pgm => {
    pgm.dropTable('siswa');
};
