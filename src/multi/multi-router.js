const express = require('express');
const multiRouter = express.Router();
const socketIo = require('socket.io');
const server = require('../socket');
const io = socketIo(server);


multiRouter
    .route('/')
    .get((req, res) => {
        res.redirect('https://http://localhost:4000/');
    });



const connections = [null, null];

io.on('connection', socket => {
    console.log('Multi Connected');

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

    // Handle Disconnect
    socket.on('disconnect', () => {
        console.log(`Player ${playerIndex} disconnected`);
        connections[playerIndex] = null;
        //Tell everyone what player number just disconnected
        socket.broadcast.emit('player-connection', playerIndex);
    });

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

    // Timeout connection
    setTimeout(() => {
        connections[playerIndex] = null;
        socket.emit('timeout');
        socket.disconnect();
    }, 600000); // 10 minute limit per player
});

module.exports = multiRouter;
