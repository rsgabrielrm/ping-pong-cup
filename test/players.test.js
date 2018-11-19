process.env.NODE_ENV = 'test'

const server = require('../app/server')
const knex = require('../db/config/database.js')
const request = require('supertest')

describe('Player', () => {
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

  test('error - FindByID player /jogadores/8', () => {
    return request(server)
      .get('/jogadores/8')
      .then(response => {
        expect(response.status).toBe(403)
      })
  })

  test('Insert player /jogadores', () => {
    return request(server)
      .post('/jogadores')
      .send({nome: 'francyne', email: 'francyne@teste.com', senha: 'francyneteste'})
      .then(response => {
        expect(response.status).toBe(200)
      })
  })

  test('FindAll players - not auth', () => {
    return request(server)
      .get('/jogadores')
      .then(response => {
        expect(response.status).toBe(403)
        expect(response.body.message).toBe('Acesso não autorizado!')
      })
  })

  test('FindAll players - yes auth', () => {
    return request(server)
      .get('/jogadores')
      .set('Authorization', `Bearer ${token}`)
      .then(response => {
        expect(response.status).toBe(200)
      })
  })

  test('Create player, cup and matches /campeonatos/1', async () => {
    return  request(server)
      .post('/jogadores')
      .send({nome: 'Gabriel teste', email: 'teste2@teste.com', senha: 'gabriel1234'})
      .then(response => {
        expect(response.status).toBe(200)
      }).then(
        request(server)
          .post('/campeonatos')
          .set('Authorization', `Bearer ${token}`)
          .send({
            nome: 'nave cup',
          }).then(response => {
            expect(response.status).toBe(200)
          }).then(
            await request(server)
              .post('/campeonatos/1')
              .set('Authorization', `Bearer ${token}`)
              .send({jogadores: [1, 2, 3]})
              .then(response => {
                expect(response.status).toBe(200)
                expect(response.body.message).toBe('Jogadores inscritos e todas partidas foram geradas')
              })
          )
      )

  })

  test('find cups player id', () => {
    return request(server)
      .get('/jogadores/1/campeonatos')
      .set('Authorization', `Bearer ${token}`)
      .then(response => {
        expect(response.status).toBe(200)
      })
  })

  test('find matches player id', () => {
    return request(server)
      .get('/jogadores/1/partidas')
      .set('Authorization', `Bearer ${token}`)
      .then(response => {
        expect(response.status).toBe(200)
      })

  })
})
