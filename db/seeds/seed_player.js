
exports.seed = function(knex, Promise) {
  return knex('players').del()
    .then(function () {
      return knex('players').insert([
        {name: 'gabriel', email: 'gabriel@teste.com', password: '$2b$12$qsm1nHofYvT6kuWA.Ef..ekBKI0DL/EDEaUx29zr8vYXm.KtbY.sa'},
        {name: 'fulano', email: 'fulano@teste.com', password: '$2b$12$vcHqfIC06hzQVnvNZ97/ge2Xup67XX1uPK7IOnknXDxguMO3X9LCi'}
      ]);
    });
};
