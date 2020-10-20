const path = require("path");
const express = require("express");

const GameService = require("./game-service");
const { requireAuth } = require("../middleware/jwt-auth");
const gameRouter = express.Router();
const jsonBodyParser = express.json();

gameRouter.route("/:id").get(async (req, res, next) => {
  try {
    const gameState = await GameService.getGameState(req.app.get("db"), req.params.id);
    res.json({
      gameState,
    });
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = gameRouter;
