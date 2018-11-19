
exports.up = function(knex, Promise) {
  return knex.schema.createTable('cups', table => {
    table.increments('id').primary()
    table.string('name', 80).notNullable()
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('cups')
};
