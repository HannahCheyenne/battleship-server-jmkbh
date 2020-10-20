require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const authRouter = require('./auth/auth-router');
const userRouter = require('./user/user-router');
const gameStatsRouter = require('./gamestats/gamestats-router');
const gameRouter = require('./game/game-router');
const chatRouter = require('./chat/chat-router');
const http = require('http')
const socketIo = require('socket.io')


const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const morganOption = (NODE_ENV === 'production')
    ? 'tiny'
    : 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/stats', gameStatsRouter);
//app.use('/api/game', gameRouter);
app.use('/api/chat', chatRouter);


app.use(function errorHandler(error, req, res, next) {
    let response;
    if (NODE_ENV === 'production') {
        response = { error: { message: 'server error' } };
    } else {
        console.error(error);
        response = { message: error.message, error };
    }
    res.status(500).json(response);
});


io.on('connection', (socket) => {
    console.log('new client connected');
    if(interval) {
        clearInterval(interval);
    }
    interval = setInterval(() => getApiAndEmit(socket), 1000);
    socket.on('disconnect', () => {
        console.log('client disconnected')
        clearInterval(interval)
    })
})

const getApiAndEmit = socket => {
    const response = new Date()
    //emitting new message, will be consumed by client
    socket.emit("From Api", response)
}

module.exports = app;