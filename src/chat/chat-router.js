const express = require('express');
const chatRouter = express.Router();
const socketIo = require('socket.io');
const { addUser,
    removeUser,
    getUser,
    getUsersInRoom } = require('./chat-users');
const server = require('../socket');
const io = socketIo(server);

chatRouter
    .route('/')
    .get((req, res) => {
        res.redirect('https://http://localhost:4000/');
    });

const connections = [null, null];

io.on('connect', (socket) => {
    socket.on('join', ({ name, room }, callback) => {
        console.log('Chat Connected');        
        
        const { error, user } = addUser({ id: socket.id, name, room });
        
        if (error) return callback(error);

        socket.join(user.room);

        socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${user.room}.` });
        socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });

        io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });

        callback();
    });
    //!Multiplayer
    // Find an available player number
    let playerIndex = -1;
    for (const i in connections) {
        if (connections[i] === null) {
            playerIndex = i;
            break;
        }
    }
    
    // Tell the connecting client what player number they are
    socket.emit('player-number', playerIndex);

    console.log(`Player ${playerIndex} has connected`);

    // Ignore player 3
    if (playerIndex === -1) return;

    connections[playerIndex] = false;

    // Tell everyone what player number just connected
    socket.broadcast.emit('player-connection', playerIndex);

    // On Ready
    socket.on('player-ready', () => {
        socket.broadcast.emit('enemy-ready', playerIndex);
        connections[playerIndex] = true;
    });

    // Check player connections
    socket.on('check-players', () => {
        const players = [];
        for (const i in connections) {
            connections[i] === null ? players.push({ connected: false, ready: false }) : players.push({ connected: true, ready: connections[i] });
        }
        socket.emit('check-players', players);
    });

    // On Fire Received
    socket.on('fire', id => {
        console.log(`Shot fired from ${playerIndex}`, id);

        // Emit the move to the other player
        socket.broadcast.emit('fire', id);
    });

    // on Fire Reply
    socket.on('fire-reply', square => {
        console.log(square);

        // Forward the reply to the other player
        socket.broadcast.emit('fire-reply', square);
    });

    //!Chat
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
        
        console.log(`Player ${playerIndex} disconnected`);
        connections[playerIndex] = null;
        //Tell everyone what player number just disconnected
        socket.broadcast.emit('player-connection', playerIndex);
    });
});

module.exports = { chatRouter };