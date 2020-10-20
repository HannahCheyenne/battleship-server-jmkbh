const express = require('express')

const ChatService = require('./chat-service')
const { requireAuth } = require('../middleware/jwt-auth')
const chatRouter = express.Router()


chatRouter
    .route('/')
    .get(requireAuth, (req, res, next) => {
        res.send({ response: 'I am alive' }).status(200)
    })



module.exports = chatRouter