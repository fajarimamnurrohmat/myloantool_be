/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('bengkel',{
        id_bengkel: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        ruang_bengkel: {
            type: 'VARCHAR(100)',
            notNull:true,
        }
    });
};

exports.down = pgm => {
    pgm.dropTable('bengkel');
};
