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
      if (!stats) {
        return res.status(404).json({
          error: 'You don\'t have any stats',
        })
      }

      res.json({
        id: stats.id,
        game_wins: stats.game_wins,
        game_losses: stats.game_losses,
        games_played: stats.games_played,
        shots_hit: stats.shots_hit,
        shots_missed: stats.shots_missed,
        carrier_destroyed: stats.carrier_destroyed,
        battleship_destroyed: stats.battleship_destroyed,
        destroyer_destroyed: stats.destroyer_destroyed,
        submarine_destroyed: stats.submarine_destroyed,
        patrolboat_destroyed: stats.patrolboat_destroyed,
        user_id: req.user.id,
      })

      next()
    } catch (error) {
      next(error)
    }
  })

gameStatsRouter
  .route('/')
  .post(requireAuth, jsonBodyParser, async (req, res, next) => {
    try {
      const updatedData = req.body
      const stats = await GameStatsService.getUsersStats(
        req.app.get('db'),
        req.user.id,
      )

      if (!stats) {
        return res.status(404).json({
          error: 'You don\'t have any stats',
        })
      }

      //make an array of all the keys in stats object(already existing stuff in DB)
      const statsKeys = Object.keys(stats)
      for (const key of statsKeys) {
        const val1 = statsKeys[key]
        const val2 = updatedData[key]
        //if the values are different (or updated) then replace the value in stats with the new data
        if (val1 !== val2) {
          stats[key] = updatedData[key]
        }
      }

      await GameStatsService.updateGameStats(
        req.app.get('db'),
        stats
      )

      const responseForUser = {
        game_wins: stats.game_wins,
        game_losses: stats.game_losses,
        games_played: stats.games_played,
        shots_hit: stats.shots_hit,
        shots_missed: stats.shots_missed,
        carrier_destroyed: stats.carrier_destroyed,
        battleship_destroyed: stats.battleship_destroyed,
        destroyer_destroyed: stats.destroyer_destroyed,
        submarine_destroyed: stats.submarine_destroyed,
        partolboat_destroyed: stats.partolboat_destroyed
      }

      return res.status(200).json(responseForUser)

    } catch (error) {
      next(error)
    }
  })

module.exports = gameStatsRouter