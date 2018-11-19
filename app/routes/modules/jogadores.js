const db = require('../../../db/config/database')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const restErros = require('restify-errors');
const protectd = require('./ath.js');

module.exports = function jogadores (server) {
  //findAll players
  server.get('/jogadores',[protectd, async (req, res, next) => {
      let limit = parseInt(process.env.QUERY_LIMIT_PAGE) || 10
      const page = parseInt(req.query.page) || 1
      const result = await db('players').count('id as id').first()
      const count = parseInt(result.id)
      const pageSize = Math.ceil(count / limit);
      await db('players')
      .select('id', 'name', 'email')
      .limit(limit)
      .offset(page * limit - limit)
      .then((dados) => {
        res.send({data: dados, count, limit, page, pageSize})
        return next()
      }).catch((error) => {
        return next(new restErros.NotFoundError('Erro ao buscar Jogadores'));
    })
  }])

  //findById player
  server.get('/jogadores/:id',[protectd, async (req, res, next) => {
      const {id} = req.params
      await db('players').select('id', 'name', 'email').where({ id }).first().then((dados) => {
        if(dados == undefined){
          throw new restErros.NotFoundError('Campeonato não encontrado')
        }
        res.send(dados)
        return next()
      }).catch((error) => {
        return next(new restErros.NotFoundError('Jogador não encontrado'));
    })
  }])

  // insert player
  server.post('/jogadores', async (req, res, next) => {
    const { nome, email, senha} = req.body
    if(!nome || !email || !senha){
      return next(new restErros.BadRequestError('Requisição mal formada'))
    }
    const salt = bcrypt.genSaltSync(12)
    const hash = bcrypt.hashSync(senha, salt)
    await db('players').insert({name: nome, email: email, password: hash}).then((resultado) => {
      if(resultado != undefined || resultado.length == 1){
        db('players').select('id', 'name', 'email').where({ id: resultado[0] }).first().then((dados) => {
          if(dados == undefined){
              throw new restErros.NotFoundError('Jogador não encontrado')
          }
          res.send(dados)
          return next();
        }).catch(next)
      }else{
        throw new restErros.InternalServerError('Houve um problema ao salvar jogador');
      }
    }).catch((error) => {
      next(new restErros.InternalServerError('Erro ao tentar cadastrar um novo jogador'))
    })
  })

  //email not update
  server.patch('/jogadores/:id',[protectd, async (req, res, next) => {
    const { id } = req.params
    const { nome, senha} = req.body
    if(!id || !nome || !senha){
      return next(new restErros.BadRequestError('Requisição mal formada'))
    }
    const salt = bcrypt.genSaltSync(12)
    const hash = bcrypt.hashSync(senha, salt)
    await db('players').update({name: nome, password: hash}).where({ id }).then((resultado) => {
      console.log('resultado put', resultado);
      if(resultado != undefined || resultado.length == 1){
        console.log('entrei no if update')
        db('players').select('id', 'name', 'email').where({ id }).first().then((dados) => {
          if(dados == undefined){
              throw new restErros.NotFoundError('Jogador não encontrado')
          }
          res.send(dados)
          return next();
        }).catch(next)
      }else{
        throw new restErros.InternalServerError('Houve um problema ao buscar jogador atualizado');
      }
    }).catch((error) => {
      next(new restErros.InternalServerError('Erro ao tentar atualizar jogador'))
    })
  }])

  server.post('/login', async (req, res, next) => {
    const { email, senha} = req.body
    if(!email || !senha){
      return next(new restErros.BadRequestError('Requisição mal formada'))
    }
    await db('players').where({email}).first().then((login)=>{
      const salt = bcrypt.genSaltSync(12)
      const hash = bcrypt.hashSync(senha, salt)
      const compare = bcrypt.compareSync(senha, login.password);
      if(!compare){
        next(new restErros.NotAuthorizedError('Credencias inválidas!'))
      }
      const token = jwt.sign({sub: login.email, iss: 'ping-pong'}, process.env.APISECRET)
      res.send({nome: login.name, email: login.email, accessToken: token})
      return next()
    }).catch((err) => {
      next(new restErros.InternalServerError('Erro ao tentar logar!'))
    })
  })

  //list cups player
  server.get('/jogadores/:id/campeonatos',[protectd, async (req, res, next) => {
      const {id} = req.params
      await db('matches')
            .select('cups.*')
            .distinct('matches.id_cup')
            .innerJoin('cups', 'matches.id_cup', '=', 'cups.id')
            .then((dados) => {
        res.send(dados)
        return next()
      }).catch((error) => {
        return next(new restErros.NotFoundError('Erro ao buscar todos os campeonatos do jogador'));
    })
  }])

  //list matches player
  server.get('/jogadores/:id/partidas',[protectd, async (req, res, next) => {
      const {id} = req.params
      let limit = parseInt(process.env.QUERY_LIMIT_PAGE) || 10
      const page = parseInt(req.query.page) || 1
      const result = await db('cups').count('id as id').first()
      const count = parseInt(result.id)
      const pageSize = Math.ceil(count / limit)
      await db('matches')
      .orWhere('id_player_one', id)
      .orWhere('id_player_two', id)
      .join('players AS p1', 'matches.id_player_one', 'p1.id')
      .join('players AS p2', 'matches.id_player_two', 'p2.id')
      .select('matches.*', {name_one:'p1.name', email_one:'p1.email', name_two:'p2.name', email_two:'p2.email'})
      .limit(limit)
      .offset(page * limit - limit)
      .map(function(row) {
        let li =
        {
          "id": row.id,
          "id_cup": row.id_cup,
          "player_one": {"id": row.id_player_one, "name": row.name_one, "email": row.email_one},
          "player_two": {"id": row.id_player_two, "name": row.name_two, "email": row.email_two},
          "id_champion_player": row.id_champion_player,
          "result_one": row.result_one,
          "result_two": row.result_two,
          "finished": row.finished
        }
        return li;
      })
      .then((dados) => {

        res.send({data: dados, count, limit, page, pageSize})
        return next()
      }).catch((error) => {
        return next(new restErros.NotFoundError('Erro ao buscar Partidas'));
      })
  }])

}
