exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('albums', {
    id: { type: 'VARCHAR(50)', primaryKey: true },
    name: { type: 'TEXT', notNull: true },
    year: { type: 'INTEGER', notNull: true },
    created_at: { type: 'TIMESTAMP', default: pgm.func('CURRENT_TIMESTAMP') },
    updated_at: { type: 'TIMESTAMP', default: pgm.func('CURRENT_TIMESTAMP') },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('albums');
};
