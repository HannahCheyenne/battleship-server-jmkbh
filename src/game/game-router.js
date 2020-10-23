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
      //!validateMove(gameBoard, x,y)
      gameState = Game.checkHit(gameState, x, y);
      console.log("newState", gameState);
      //!changePlayer
      await Game.postGameState(req.app.get("db"), gameState);
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
    const newGame = req.body;
    console.log("req.body", req.body)
    const id = await Game.initializeGame(req.app.get("db"), newGame);
    console.log("id", id)
    const rawState = await Game.getGameState(req.app.get("db"), id[0])
    const gameState = rawState[0];
    res.json({
      gameState,
    });
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = gameRouter;
