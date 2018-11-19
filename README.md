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

**For protected routes**
For protected routes, send a header containing your token, example:
```json
{ 
    "Autorization": "Bearer asdfasciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmcmFuY3luZWVAdGVzdGUuY29tIiwiaXNzIjoicGluZy1wb25nIiwiaWF0IjoxNTQyNjQ4ODQ0fQ.3rAG5CO-eZd_uQiSHTUBYsvB5BVHIOoKy96tMawqr8"
}
```

**List Players**
List all players, protected route

```
    GET /jogadores
```
You have to send a header containing

```json
{   
    "Autorization": "Bearer {your token}" 
}
```
Returns all players
```json
{
    "data": [
        {
            "id": 1,
            "name": "gabriel",
            "email": "gabriel@teste.com"
        },
        {
            "id": 2,
            "name": "fulano",
            "email": "fulano@teste.com"
        },
        {
            "id": 3,
            "name": "User test",
            "email": "userteste@newtest.com"
        }
    ],
    "count": 3,
    "limit": 10,
    "page": 1,
    "pageSize": 1
}
```

**List One Player ID**
List all players, protected route

```
    GET /jogadores/:id
    example
    GET /jogadores/1
```

You have to send a header containing

```json
{   
    "Autorization": "Bearer {your token}" 
}
```
Returns player
```json
{
    "id": 1,
    "name": "gabriel",
    "email": "gabriel@teste.com"
}
```

**Update player**
```
    PATCH /jogadores/1
```
You have to send a header containing

```json
{   
    "Autorization": "Bearer {your token}" 
}
```
You have to send a body containing, email not update
```json
{
    "nome": "New test",
    "senha": "newpassword"
}
```

Returns player
```json
{
    "id": 1,
    "name": "new user",
    "email": "gabriel@teste.com"
}
```
**List all the championships that the player is enrolled in**
```
    GET /jogadores/1/campeonatos
```
You have to send a header containing

```json
{   
    "Autorization": "Bearer {your token}" 
}
```

Results
```
    []
```
OR
```json
[
    {
        "id": 1,
        "name": "nave cup",
        "id_cup": 1
    }
]
```
**List all the matches that the player is enrolled in**
```
    GET /jogadores/1/partidas
```
You have to send a header containing

```json
{   
    "Autorization": "Bearer {your token}" 
}
```

Results
```
{
    "data": [],
    "count": 1,
    "limit": 10,
    "page": 1,
    "pageSize": 1
}
```
OR
```json
{
    "data": [
        {
            "id": 2,
            "id_cup": 1,
            "player_one": {
                "id": 1,
                "name": "new user",
                "email": "gabriel@teste.com"
            },
            "player_two": {
                "id": 2,
                "name": "fulano",
                "email": "fulano@teste.com"
            },
            "id_champion_player": null,
            "result_one": "0 x 0",
            "result_two": "0 x 0",
            "finished": 0
        },
        {
            "id": 3,
            "id_cup": 1,
            "player_one": {
                "id": 1,
                "name": "new user",
                "email": "gabriel@teste.com"
            },
            "player_two": {
                "id": 3,
                "name": "User test",
                "email": "userteste@newtest.com"
            },
            "id_champion_player": null,
            "result_one": "0 x 0",
            "result_two": "0 x 0",
            "finished": 0
        }
    ],
    "count": 2,
    "limit": 10,
    "page": 1,
    "pageSize": 1
}
```



**Enroll championship players**
```
    POST /campeonatos/1
```
You have to send a header containing

```json
{   
    "Autorization": "Bearer {your token}" 
}
```

You have to send a body containing, email not update
```json
{
    "jogadores": ["1", "2", "3"]
}
```

Result
```json
{
    "code": "Success",
    "message": "Jogadores inscritos e todas partidas foram geradas"
}
```





