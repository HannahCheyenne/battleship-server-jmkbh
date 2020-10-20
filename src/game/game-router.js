const path = require("path");
const express = require("express");

const GameService = require("./game-service");
const { requireAuth } = require("../middleware/jwt-auth");
const { postGameState } = require("./game-service");
const gameRouter = express.Router();
const jsonBodyParser = express.json();

gameRouter
  .route("/:id")
  .get(jsonBodyParser, async (req, res, next) => {
    try {
      const gameState = await GameService.getGameState(
        req.app.get("db"),
        req.params.id
      );
      res.json({
        gameState,
      });
      next();
    } catch (error) {
      next(error);
    }
  })
  .post(jsonBodyParser, async (req, res, next) => {
    try {
      const gameState = await GameService.getGameState(
        req.app.get("db"),
        req.params.id
      );
      const { x, y } = req.body;

      console.log("y", y);
      console.log("x", x);
      console.log("gameState", gameState[0].p1_board);

      gameState[0].p1_board[y][x] = 8;

      //replace this with magic later
      GameService.postGameState(req.app.get("db"), gameState);

      res.json({
        gameState,
      });
      next();
    } catch (error) {
      next(error);
    }
  });

module.exports = gameRouter;
