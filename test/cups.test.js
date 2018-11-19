process.env.NODE_ENV = 'test'

const server = require('../app/server')
const knex = require('../db/config/database.js')
const request = require('supertest')


describe('Cups', () => {
  let user = {name: 'gabriel', email: 'teste@teste.com', password: 'newpasstest'}
  let token
  beforeAll(async (done) => {
    await knex.migrate.latest()
    request(server)
      .post('/jogadores')
      .send({nome: user.name, email: user.email, senha: user.password})
      .then(response => {
        expect(response.status).toBe(200)
      }).then(
        request(server)
          .post('/login')
          .send({
            email: user.email,
            senha: user.password,
          })
          .end((err, response) => {
            token = response.body.accessToken;
            done();
          })
      )
  })

  afterAll(async () => {
    await knex.migrate.rollback()
  })


  test('findByID error /campeonatos/1', () => {
    return request(server)
      .get('/campeonatos/1')
      .then(response=>{
        expect(response.status).toBe(404)
      })
  })

  test('insert cup /campeonatos', () => {
    return request(server)
      .post('/campeonatos')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nome: 'nave cup',
      }).then(response => {
        expect(response.status).toBe(200)
      })
  })

  test('get all /campeonatos',  () => {
    return request(server)
      .get('/campeonatos')
      .then(response => {
        expect(response.status).toBe(200)
      }).catch(fail)
  })

  test('findByID Success /campeonatos/1', () => {
    return request(server)
      .get('/campeonatos/1')
      .then(response => {
        expect(response.status).toBe(200)
        expect(response.body.id).toBe(1)
        expect(response.body.name).toBe('nave cup')
      })
  })

})
