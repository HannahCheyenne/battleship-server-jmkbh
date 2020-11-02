# Space Battleship API
See the API in action at [SPACE BATTLESHIP](https://spacebattleship.vercel.app/)

## Summary
The Space Battleship API is built on an Express framework and utilizes a postgreSQL database. The API is built to handle data sent from users for private use. <br>
The API's base url is : 'https://battleship-server-jmkbh.herokuapp.com/api'
The API has 9 endpoints:
1. '/users' - Endpoint for user registration
2. '/auth/login' - Endpoint for user login authentication
3. '/stats' - Endpoint for handling a users stats
4. '/game/gamestate/:id' - Endpoint for handling the game state of a game session
5. '/game/newgame' - Endpoint for handling new single player game
6. '/game/mp/newgame' - Endpoint for handling a new multiplayer game
7. '/game/mp/setboard/:id' - Endpoint for handling a users board in a multiplayer game
8. '/game/genboard' - Endpoint for generating a random board for the user
9. '/game/aimove/:id' - Endpoint for getting the AI's move

## '/users'
The users endpoint accepts POST requests to create new user accounts.<br>
User details should be sent in the request body in JSON format.<br>
the required fields to POST a new user account are:
1. 'first_name' - string containing the new user's first name
2. 'last_name' - string containing the new user's last name
3. 'email' - string containing the new user's email
4. 'username' - string containing a username, will be validated as unique by the API
5. 'password' - string containing a password. Must include at least: 1 uppercase, 1 lowercase, 1 special character, 1 number and be between 8 and 72 characters. password is hashed using bcrypt

A succesful POST of a new user will return the newly created user object with all required fields serialized as well as the creation date and user ID.

## '/auth/login
The auth/login endpoint accepts POST requests to validate user login requests.<br>
Login details should be sent in the request body in JSON format.<br>
the required fields to POST a login request are:
1. 'username' - string containing username
2. 'password' - string containing password

The username is checked against the list of users in the database then the password is validated by comparing it to the hashed password stored in the database.<br>
A successful POST of a user login will return a response body containing an authToken that must be stored in the users browser storage to access the discs, bags, and scorecards endpoints.
## '/stats'
## '/game/gamestate/:id'
## '/game/newgame'
## '/game/mp/newgame/setboard/:id'
## '/game/genboard'
## '/game/aimove/:id'

## Dependencies and Docs
Express was used as the framework for handling HTTP requests. PostgreSQL was used to handle the database. Knex.js was used to build SQL queries. the full list of the tech stack used as well as dependencies and their docs can be seen below.<br>

postgreSQL [postgreSQL docs](https://www.postgresql.org/docs/12/index.html)<br>
Express [express docs](https://expressjs.com/)


1. cors - middleware for enabling cross origin resource sharing [cors docs](https://www.npmjs.com/package/cors)
2. dotenv - loads variables from .env files to process.env [dotenv docs](https://www.npmjs.com/package/dotenv)
3. helmet - secure express apps by setting/hiding http headers [helmet docs](https://helmetjs.github.io/)
4. knex - SQL query builder for postgreSQL and various other SQL databases [knex docs](https://helmetjs.github.io/)
5. morgan - http request logger middleware [morgan docs](https://www.npmjs.com/package/morgan)
6. pg - postgres drivers needed for winston and knex [pg docs](https://www.npmjs.com/package/pg)
7. winston - creates a log file of http requests [winston docs](https://www.npmjs.com/package/winston)
8. xss - filters cross site scripting from user input [xss docs](https://www.npmjs.com/package/xss)
9. chai - test assertion library, pairs with mocha [chai docs](https://www.chaijs.com/)
10. mocha - test framework [mocha docs](https://mochajs.org/)
11. nodemon - monitors for code changes and refreshes server [nodemon docs](https://nodemon.io/)
12. postgrator(-cli) - command line SQL database migration tool [postgrator docs](https://www.npmjs.com/package/postgrator-cli?activeTab=readme)
13. supertest - http assertion tool to be used with mocha/chai [supertest docs](https://www.npmjs.com/package/supertest)
14. socket.io - enables real-time bidirectional event-based communication. [socket.io docs](https://www.npmjs.com/package/socket.io)
