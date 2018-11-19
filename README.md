# ping-pong-cup
Api Torneio de Ping-Pong

Create database and test database

Create file .env (examples in .env-example)

Install dependencies:
```sh
 $ npm install
```
Migrate and seed database 
```sh
  $ cd db && knex migrate:latest && knex seed:run
```
Start App
```sh
 $ npm start
``` 
Tests
```sh
 npm test
```

# Documentation

**Create new player**
```
    POST /jogadores
```
You have to send a body containing
```json
{
	"nome": "User test",
	"email": "userteste@newtest.com",
	"senha": "mypassword"
}
```
Return new player created
```json
{
	"id": 3,
	"nome": "User test",
	"email": "userteste@newtest.com"
}
```

**Login player**
```
    POST /login
```
You have to send a body containing
```json
{
	"email": "userteste@newtest.com",
	"senha": "mypassword"
}
```
Returns logged player
```json
{
   	"nome": "User test",
	"email": "userteste@newtest.com",
 	"accessToken": "asdfasciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmcmFuY3luZWVAdGVzdGUuY29tIiwiaXNzIjoicGluZy1wb25nIiwiaWF0IjoxNTQyNjQ4ODQ0fQ.3rAG5CO-eZd_uQiSHTUBYsvB5BVHIOoKy96tMawqr8"
}
```
