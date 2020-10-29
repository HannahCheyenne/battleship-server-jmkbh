const path = require('path')
const express = require('express')

const AiGameService = require('./aigame-service')
const { requireAuth } = require('../middleware/jwt-auth')

const aiGameRouter = express.Router()
const jsonBodyParser = express.json()

aiGameRouter
    .route('/:id')
    .get(async(req, res, next) => {
        //assumption is that it should be grabbing clean board
        //ai_board row 1 contains clean board, grab that set as state 
        try {
            const state = await AiGameService.getGameState(
                req.app.get('db'),
                req.params.id
            )
            res
              .status(200)
              .json({
                state,
              });

            next();
        } catch(error) {
            next(error);
        }
    })
    .post(requireAuth, jsonBodyParser, async (req, res, next) => {
        try {
            const state = await AiGameService.getGameState(
                req.app.get('db'),
                req.params.id
            )
            const { x, y } = req.body;

            //purpose is to change the values here VALIDATE THE MOVE
            let newState = AiGameService.checkHit(state, x, y)
            newState.playerTurn = false;

            // updates the database
            await AiGameService.updateGameState(
                req.app.get('db'),
                newState
            );

            res.json({
                newState,
            })

            next();
        } catch(error) {
            next(error);
        }
    })

aiGameRouter
    .route('/newaigame')
    .post(requireAuth, jsonBodyParser, async(req, res, next) => {
        try {
            //inserts new row into game_state table with new id and clean boards
            const stuff = await AiGameService.initializeGame(
                req.app.get('db'),

            )

            next();
        } catch(error) {
            next(error);
        }
    })