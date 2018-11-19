const restify = require('restify');
const server = restify.createServer({ name: 'api' });
const routes = require('./routes/routes')

routes(server)

// plugin do restify para parser a query para json
server.use(restify.plugins.queryParser());
// plugin do restify para parserar o body para json
server.use(restify.plugins.bodyParser());

module.exports = server
