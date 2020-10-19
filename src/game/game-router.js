// const path = require('path')
// const express = require('express')

// const GameService = require('./game-service')
// const { requireAuth } = require('../middleware/jwt-auth')
// const gameRouter = express.Router()
// const jsonBodyParser = express.json()

// gameRouter
//   .route('/:id')
//   .get(async (req, res, next) => {
//     try {
//       const gameState = await GameService.getGameState(
//         req.app.get('db'))
//       res.json({
//         gameState
//       })
//       next()
//     } catch (error) {
//       next(error)
//     }
//   })

//   .route('/board')
//   .get(async (req, res, next) => {
//     try {
//       const gameState = await GameService.getGameBoard(
//         req.app.get('db'))
//       res.json({
//         gameBoard
//       })
//       next()
//     } catch (error) {
//       next(error)
//     }
//   })
//   .post(async ())

// module.exports = gameStatsRouter