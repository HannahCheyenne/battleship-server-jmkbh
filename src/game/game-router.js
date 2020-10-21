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
      const gameState = await Game.getGameState(
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
  .patch(jsonBodyParser, async (req, res, next) => {
    try {
      const gameState = await Game.getGameState(
        req.app.get("db"),
        req.params.id
      );
      const { x, y } = req.body;

      console.log("gameState", gameState);
      //do magic here

      //validateMove(gameBoard, x,y)
      //const newBoard = Game.checkHit(x,y)

      if (gameState[0].p1_board[x][y] > 1) {
        gameState[0].p1_board[x][y] = 8;
      } else {
        gameState[0].p1_board[x][y] = 0;
      }

      await Game.postGameState(req.app.get("db"), gameState[0]);
      res.json({
        gameState,
      });
      next();
    } catch (error) {
      next(error);
    }
  });

gameRouter.route("/newgame").post(jsonBodyParser, async (req, res, next) => {
  try {
    const playerBoard = req.body.game_board;

    const gameState = await Game.initializeGame(playerBoard);

    //do more magic here

    res.json({
      gameState,
    });
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = gameRouter;
