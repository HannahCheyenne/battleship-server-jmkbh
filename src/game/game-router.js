const path = require("path");
const express = require("express");
const Game = require("./game-service");
const { requireAuth } = require("../middleware/jwt-auth");
const { postGameState, initializeGame } = require("./game-service");
const gameRouter = express.Router();
const jsonBodyParser = express.json();
const GameStatsService = require("../gamestats/gamestats-service");

gameRouter
  .route("/gamestate/:id")
  .get(jsonBodyParser, async (req, res, next) => {
    try {
      let gameState = await Game.getGameState(req.app.get("db"), req.params.id);
      res.json({
        //returns entire object
        gameState,

        // deconstructs data
        // id: gameState.id,
        // p1_board: gameState.p1_board,
        // p2_board: gameState.p2_board,
        // p1_health: gameState.p1_health,
        // p2_health: gameState.p2_health,
        // player_turn: gameState.player_turn,
        // active_game: gameState.active_game
      });
      next();
    } catch (error) {
      next(error);
    }
  })
  .patch(requireAuth, jsonBodyParser, async (req, res, next) => {
    try {
      let gameState = await Game.getGameState(req.app.get("db"), req.params.id);
      const { x, y } = req.body;
      const user_id = req.user.id;
      let stats = await GameStatsService.getUsersStats(
        req.app.get("db"),
        user_id
      ).then((data) => {
        return data;
      });
      results = Game.checkHit(gameState, x, y, stats);
      gamestate = results[0];
      stats = results[1];

      //await GameStatsService.updateGameStats(req.app.get("db"), stats);

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
    // console.log("board", board);
    res.json({
      board,
    });
    next();
  } catch (error) {
    next(error);
  }
});

gameRouter
  .route("/aimove/:id")
  .patch(requireAuth, jsonBodyParser, async (req, res, next) => {
    try {
      let gameState = await Game.getGameState(req.app.get("db"), req.params.id);
      let stats = await GameStatsService.getUsersStats(
        req.app.get("db"),
        req.user.id
      ).then((data) => {
        return data;
      });

      const { x, y } = req.body;

      results = Game.checkAiHit(gameState, stats, x, y);
      gameState = results[0];
      stats = results[1];
      gameState.player_turn = true;
      //await GameStatsService.updateGameStats(req.app.get("db"), stats);
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
