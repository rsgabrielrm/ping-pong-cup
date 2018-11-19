
exports.up = function(knex, Promise) {
  return knex.schema.createTable('matches', table => {
    table.increments('id').primary()
    table.integer('id_cup').unsigned()
    table.foreign('id_cup').references('id').inTable('cups')
    table.integer('id_player_one').unsigned()
    table.foreign('id_player_one').references('id').inTable('players')
    table.integer('id_player_two').unsigned()
    table.foreign('id_player_two').references('id').inTable('players')
    table.integer('id_champion_player').unsigned()
    table.foreign('id_champion_player').references('id').inTable('players')
    table.string('result_one').defaultTo('0 x 0')
    table.string('result_two').defaultTo('0 x 0')
    table.boolean('finished').defaultTo('false')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('matches')
};
