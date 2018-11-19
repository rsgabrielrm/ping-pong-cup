const db = require('../../../db/config/database')
const bcrypt = require('bcrypt')
const restErros = require('restify-errors');
const jwt = require('jsonwebtoken')

function extractToken(req) {
  const authorization = req.headers.authorization;
  if (authorization) {
      let token = undefined;
      const parts = authorization.split(' ');
      if (parts.length === 2 && parts[0] === 'Bearer') {
          token = parts[1];
      }
      return token;
  }
}

// verifica token
function verifytoken (req){
  return new Promise((resolve, reject) => {
    const token = extractToken(req)
    if(token){
      try {
        const verifica = jwt.verify(token, process.env.APISECRET)
        if(verifica){
          const email = verifica.sub
          db('players').where({email}).first().then((result) => {
            resolve({authenticated:{id: result.id, jogador: result.name, email: result.email}})
          }).catch((err) => {
            resolve(new restErros.NotAuthorizedError('Erro ao tentar associar token'))
          })
        }
      } catch(err) {
        resolve(new restErros.NotAuthorizedError('Acesso não autorizado!'))
      }
    } else {

      resolve({authenticated: undefined})
    }
  })
// fim verifica token

}


const protectd = async(req, res, next) => {
  const autorizado = await verifytoken(req)
  if(autorizado.authenticated == undefined){
    res.send(new restErros.NotAuthorizedError('Acesso não autorizado!'))
    next(false);
  }
  req.headers = autorizado
  next()
}

module.exports = protectd
