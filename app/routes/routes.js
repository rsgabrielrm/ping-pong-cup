const knex = require('../../db/config/database')
const bcrypt = require('bcrypt')
const restErros = require('restify-errors')
//import modules
const jogadores = require('./modules/jogadores')
const campeonatos = require('./modules/campeonatos')
const partidas = require('./modules/partidas')

const routes = (server) => {
  //applyroutes
  jogadores(server)
  campeonatos(server)
  partidas(server)
  server.get('/', (req, res, next) => {
    res.send("Api - Ping-Pong");
    next()
  })
  server.post('/autenticacao', async (req, res, next) => {
    try {
      const { email, senha } = req.body
      res.send(await db.auth().authenticate(email, senha))
    } catch (error) {
      res.send(new restErros[error.restErr](error.err))
    } finally{
      next()
    }
  })

  server.get('/verifica', async (req, res, next) => {
    try {
      const autorizado = await db.auth().verifytoken(req);
      res.send(autorizado);
    } catch(error) {
      res.send(new restErros.InternalServerError('Erro ao tentar verificar token'))
    } finally{
      next()
    }
  })

}

module.exports = routes
