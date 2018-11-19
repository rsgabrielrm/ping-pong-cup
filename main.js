require('dotenv').config()
const server = require('./app/server')

server.listen(process.env.SERVER_PORT, () => {
    console.log('server listen on ', process.env.SERVER_PORT);
});

module.exports = server;
