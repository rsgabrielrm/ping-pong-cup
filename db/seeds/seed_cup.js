
exports.seed = function(knex, Promise) {
  return knex('cups').del()
    .then(function () {
      return knex('cups').insert([
        {name: 'nave cup'}
      ]);
    });
};
