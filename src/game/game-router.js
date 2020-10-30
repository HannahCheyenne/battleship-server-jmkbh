const path = require("path");
const express = require("express");
const Game = require("./game-service");
const { requireAuth } = require("../middleware/jwt-auth");
const { postGameState, initializeGame } = require("./game-service");
const gameRouter = express.Router();
const jsonBodyParser = express.json();

gameRouter
  .route("/gamestate/:id")
  .get(jsonBodyParser, async (req, res, next) => {
    try {
      let gameState = await Game.getGameState(req.app.get("db"), req.params.id);
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
      let gameState = await Game.getGameState(req.app.get("db"), req.params.id);

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
      let gameState = await Game.getGameState(req.app.get("db"), id[0]);

      res.json({
        gameState,
      });
      next();
    } catch (error) {
      next(error);
    }
  });

gameRouter
  .route("/mp/newgame")
  .post(requireAuth, jsonBodyParser, async (req, res, next) => {
    try {
      const id = await Game.initializeMPGame(req.app.get("db"));
      let gameState = await Game.getGameState(req.app.get("db"), id[0]);
      res.json({
        gameState,
      });
      next();
    } catch (error) {
      next(error);
    }
  });

gameRouter
  .route("/mp/setboard/:id")
  .patch(requireAuth, jsonBodyParser, async (req, res, next) => {
    try {
      const newBoard = req.body;
      const id = req.params.id;
      let gameState = await Game.getGameState(req.app.get("db"), id);

      let newState = await Game.setMPBoard(
        req.app.get("db"),
        gameState,
        newBoard
      );

      res.json({
        newState,
      });
      next();
    } catch (error) {
      next(error);
    }
  });

gameRouter.route("/genboard").get((req, res, next) => {
  try {
    const board = Game.generateBoard();
    console.log("board", board);
    res.json({
      board,
    });
    next();
  } catch (error) {
    next(error);
  }
});

gameRouter.route("/aimove/:id").patch(async (req, res, next) => {
  try {
    let gameState = await Game.getGameState(req.app.get("db"), req.params.id);
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
