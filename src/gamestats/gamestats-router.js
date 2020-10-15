const path = require('path')
const express = require('express')

const GameStatsService = require('./gamestats-service')
const { requireAuth } = require('../middleware/jwt-auth')
const gameStatsRouter = express.Router()
const jsonBodyParser = express.json()

gameStatsRouter
  .route('/')
  .get(requireAuth, async (req, res, next) => {
    try {
      const stats = await GameStatsService.getUsersStats(
        req.app.get('db'),
        req.user.id,
      )
      res.json({
        stats
      })
      next()
    } catch (error) {
      next(error)
    }
  })

module.exports = gameStatsRouter