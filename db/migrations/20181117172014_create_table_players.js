
exports.up = function(knex, Promise) {
  return knex.schema.createTable('players', table => {
    table.increments('id').primary()
    table.string('name', 80).notNullable()
    table.string('email', 80).unique().notNullable()
    table.string('password', 80).notNullable()
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('players')
};
