const knex = require('knex');
const { app, server } = require('./app');
const { HTTP_PORT, WS_PORT, DATABASE_URL } = require('./config');


const db = knex({
    client: 'pg',
    connection: DATABASE_URL,
});

app.set('db', db);

app.listen(HTTP_PORT, () => {
    console.log(`Server listening at http://localhost:${HTTP_PORT}`);
});

server.listen(WS_PORT, () => {
    console.log(`Chat started at http://localhost:${WS_PORT}`);
});