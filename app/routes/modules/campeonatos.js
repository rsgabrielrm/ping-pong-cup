const db = require('../../../db/config/database')
const bcrypt = require('bcrypt')
const restErros = require('restify-errors');
const protectd = require('./ath.js');

module.exports = function campeonatos (server) {

  server.get('/campeonatos', async (req, res, next) => {
    let limit = parseInt(process.env.QUERY_LIMIT_PAGE) || 10
    const page = parseInt(req.query.page) || 1
    const result = await db('cups').count('id as id').first()
    const count = parseInt(result.id)
    const pageSize = Math.ceil(count / limit);
    await db('cups')
    .select('id', 'name')
    .limit(limit)
    .offset(page * limit - limit)
    .then((dados) => {
      res.send({data: dados, count, limit, page, pageSize})
      return next()
    }).catch((error) => {
      return next(new restErros.NotFoundError('Erro ao buscar Campeonatos'));
    })
  })

  server.get('/campeonatos/:id', async (req, res, next) => {
    const {id} = req.params
    await db('cups').where({ id }).first().then((dados) => {
      if(dados == undefined){
        throw new restErros.NotFoundError('Campeonato não encontrado')
      }
      res.send(dados)
      return next();
    }).catch(next)
  })

  server.post('/campeonatos', [protectd, async (req, res, next) => {
    const { nome } = req.body
    if(!nome || nome == undefined || nome.length < 3){
      return next(new restErros.BadRequestError('Requisição mal formada: O nome deve ser informado com no mínimo 3 caracteres'))
    }
    await db('cups').insert({name: nome}).then((resultado) => {
      if(resultado != undefined || resultado.length == 1){
        db('cups').where({ id: resultado[0] }).first().then((dados) => {
          if(dados == undefined){
              throw new restErros.NotFoundError('Campeonato não encontrado')
          }
          res.send(dados)
          return next();
        }).catch(next)
      }else{
        throw new restErros.InternalServerError('Houve um problema ao salvar campeonato');
      }
    }).catch((error) => {
      console.log("error", error);
      next(new restErros.InternalServerError('Erro ao tentar cadastrar um novo campeonato'))
    })
  }])

  // gera partidas
  server.post('/campeonatos/:id', [protectd, async (req, res, next) => {
    const { id } = req.params
    const { jogadores } = req.body
    if(!id || !jogadores){
      return next(new restErros.BadRequestError('Requisição mal formada'))
    }
    if(jogadores.length < 2){
      return next(new restErros.BadRequestError('Você precisa informar no mínimo 2 jogadores'))
    }
    await db('cups').where({ id }).first().then((dados) => {
      if(dados == undefined){
        return next(new restErros.NotFoundError('Campeonato não encontrado'))
      }
      new Promise( function(resolve, reject){
        for (let i = 0; i < jogadores.length; i++) {
          for (let k = i + 1; k < jogadores.length; k++) {
            db('matches')
              .orWhere({id_cup: id, id_player_one: jogadores[i], id_player_two: jogadores[k]})
              .orWhere({id_cup: id, id_player_one: jogadores[k], id_player_two: jogadores[i]})
              .then((rst) => {
                if(rst.length < 1){
                    db('matches').insert({id_cup: id, id_player_one: jogadores[i], id_player_two: jogadores[k]})
                      .then((result) => {
                        return next()
                      }).catch((error) => {
                        next(new restErros.InternalServerError('Erro ao cadastrar partidas'))
                      })
                  } else {
                    return next()
                  }
            }).catch((err) => {
              console.log(err, "err")
              next(new restErros.InternalServerError('Erro ao verificar se já existe partidas'))
            })
          }
        }
      });
      res.send({"code": "Success", "message": "Jogadores inscritos e todas partidas foram geradas"})
      return next()
    })
  }])

  server.del('/campeonatos/:id', async (req, res, next) => {
    const {id} = req.params
     await db('cups').where({id}).del().then((result) => {
       console.log('resultado delete', result)
       if(result == 1){
         res.send({"code": "Success", "message": "Campeonato deletado com sucesso"});
         return next()
       }
       return next(new restErros.NotFoundError('Campeonato não encontrado'))
     }).catch((err) => {
       console.log(err)
      return next(new restErros.InternalServerError('Erro ao tentar deletar campeonato'))
    })
  })
}
