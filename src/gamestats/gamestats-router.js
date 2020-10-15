const path = require('path')
const express = require('express')

const GameStatsService = require('./gamestats-service')
const { requireAuth } = require('../middleware/jwt-auth')
const gameStatsRouter = express.Router()
const jsonBodyParser = express.json()

gameStatsRouter
    .route('/')
    .get((req, res, next) => {
        GameStatsService.getUsersStats(req.app.get('db'))
        .then(stats => {
          // console.log(affirmations)
          res.json(stats.map())
        })
        .catch(next)
    })

module.exports = gameStatsRouter