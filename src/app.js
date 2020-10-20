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
const app = express();

//chat features
const router = require('./router');

const http = require('http');
const socketio = require('socket.io');
const { addUser,
    removeUser,
    getUser,
    getUsersInRoom } = require('./user/users');
const server = http.createServer(app);
const io = socketio(server);
app.use(router);
//---------------------------//


const morganOption = (NODE_ENV === 'production')
    ? 'tiny'
    : 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

// router.get('/chat', (req, res) => {
//     res
//         //.send('Reached Chat')
//         .redirect('https://http://localhost:4000/');
// });

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/stats', gameStatsRouter);
//app.use('/api/game', gameRouter);

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


//Chat Stuff//
io.on('connect', (socket) => {
    socket.on('join', ({ name, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, name, room });

        if (error) return callback(error);

        socket.join(user.room);

        socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${user.room}.` });
        socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });

        io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });

        callback();
    });

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);

        io.to(user.room).emit('message', { user: user.name, text: message });

        callback();
    });

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);

        if (user) {
            io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
            io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
        }
    });
});
//------------------------------------------------------------//

module.exports = { app, server };