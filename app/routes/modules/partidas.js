const db = require('../../../db/config/database')
const bcrypt = require('bcrypt')
const restErros = require('restify-errors');
const protectd = require('./ath.js');

module.exports = function partidas (server) {

  server.get('/partidas', [protectd, async (req, res, next) => {
    let limit = parseInt(process.env.QUERY_LIMIT_PAGE) || 10
    const page = parseInt(req.query.page) || 1
    const result = await db('matches').count('id as id').first()
    const count = parseInt(result.id)
    const pageSize = Math.ceil(count / limit)
    await db('matches')
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

  server.get('/partidas/:id', [protectd , async (req, res, next) => {
    const {id} = req.params
    await db('matches')
      .where({ 'matches.id': id })
      .join('players AS p1', 'matches.id_player_one', 'p1.id')
      .join('players AS p2', 'matches.id_player_two', 'p2.id')
      .select('matches.*', {name_one:'p1.name', email_one:'p1.email', name_two:'p2.name', email_two:'p2.email'})
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
      }).then((result) => {
        res.send(result[0])
        next()
      }).catch(
        next(false)
      )
    }])

  server.patch('/partidas/:id', [protectd, async (req, res, next) => {
    const {id} = req.params
    const {score} = req.body
    if(!score || score.split('x')[0].trim().replace(/[^0-9]/g,'') === '' || score.split('x')[1].trim().replace(/[^0-9]/g,'') === ''){
      return next(new restErros.BadRequestError('Requisição mal formada: Resultado informado deve ser no formato "1 x 1"'))
    }
    await db('matches').where({id}).first().then((result) => {
      if(result.finished){
        res.send({
          'code': 'Success',
          'message': 'Essa partida já está finalizada'
        })
        return next()
      };
      if(result.result_one !== '0 x 0'){
        let playerWinner = null
        let finish = false
        if(score === result.result_one){
          let scoreWinner = score.split('x')
          if(scoreWinner[0].trim().replace(/[^0-9]/g,'') > scoreWinner[1].trim().replace(/[^0-9]/g,'')){
            playerWinner = result.id_player_one
          } else {
            playerWinner = result.id_player_two
          }
          finish = true
        }
        db('matches').update({'result_two': score, 'id_champion_player': playerWinner, 'finished': finish}).where({ id }).then((upresult) => {
          res.send({"code": "Success", "message": "Resultado informado com sucesso"})

          return next()
        }).catch((error) => {
          return next(new restErros.InternalServerError("Erro ao salvar resultado e setar ganhador"))
        })
      } else {
        db('matches').update({'result_one': score}).where({ id }).then((upresult) => {
          console.log('upresult one', upresult);
          res.send({"code": "Success", "message": "Resultado informado com sucesso"})
          return next()
        }).catch((error) => {
          return next(new restErros.InternalServerError('Erro ao salvar resultado'))
        })
      }
    }).catch((erro) => {
        return next(new restErros.InternalServerError('Erro ao consultar partida'))
      })
    }])
  }
