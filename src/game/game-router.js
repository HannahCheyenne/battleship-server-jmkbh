const path = require("path");
const express = require("express");

const Game = require("./game-service");
const { requireAuth } = require("../middleware/jwt-auth");
const { postGameState, initializeGame } = require("./game-service");
const gameRouter = express.Router();
const jsonBodyParser = express.json();

gameRouter
  .route("/:id")
  .get(jsonBodyParser, async (req, res, next) => {
    try {
      const rawState = await Game.getGameState(
        req.app.get("db"),
        req.params.id
      );
      gameState = rawState[0];
      res.json({
        gameState,
      });
      next();
    } catch (error) {
      next(error);
    }
  })

  .patch(jsonBodyParser, async (req, res, next) => {
    try {
      const rawState = await Game.getGameState(
        req.app.get("db"),
        req.params.id
      );
      let gameState = rawState[0];
      const { x, y } = req.body;
      //TODO validateMove(gameBoard, x,y)
      gameState = Game.checkHit(gameState, x, y);
      gameState.player_turn = false;
      await Game.postGameState(req.app.get("db"), gameState);
      res.json({
        gameState,
      });
      next();
    } catch (error) {
      next(error);
    }
  });

gameRouter
  .route("/newgame")
  .post(requireAuth, jsonBodyParser, async (req, res, next) => {
    try {
      const newGame = req.body;
      const id = await Game.initializeGame(req.app.get("db"), newGame);
      const rawState = await Game.getGameState(req.app.get("db"), id[0]);
      const gameState = rawState[0];
      res.json({
        gameState,
      });
      next();
    } catch (error) {
      next(error);
    }
  });

gameRouter.route('/genboard').get( async (req, res, next) => {
  try {
    const newBoard = await Game.test();
    console.log("board", newBoard)
    res.json({
      board,
    });
    next()
  } catch (error) {
    next(error)
  }
});

gameRouter.route("/aimove/:id").patch(async (req, res, next) => {
  try {
    const rawState = await Game.getGameState(req.app.get("db"), req.params.id);
    let gameState = rawState[0];

    gameState = Game.checkAiHit(gameState);

    gameState.player_turn = true;

    await Game.postGameState(req.app.get("db"), gameState);
    res.json({
      gameState,
    });
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = gameRouter;
