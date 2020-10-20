const GameService = {
  getGameState(db, id) {
    return db
      .from("game_state")
      .select(
        "id",
        "p1_board",
        "p2_board",
        "p1_health",
        "p2_health",
        "player_turn",
        "active_game"
      )
      .where("id", id);
  },

  postGameState(db, newState) {
    return db("game_state").where({ id: newState.id }).update({
      p1_board: newState.p1_board,
      p2_board: newState.p2_board,
      p1_health: newState.p1_health,
      p2_health: newState.p2_health,
      player_turn: newState.player_turn,
      active_game: newState.active_game,
    });
  },

  checkHit(gameBoard, x, y) {
    const cell = gameBoard[y][x];

    if (cell > 1) {
      //TODO - update ship health
      gameBoard[y][x] = 8;
    } else {
      gameBoard[y][x] = 0;
    }

    return gameBoard;
  },

  initializeGame(db, game_board) {
    return db
      .from("game_state")
      .select(
        "id",
        "p1_board",
        "p2_board",
        "p1_health",
        "p2_health",
        "player_turn",
        "active_game"
      )
      .where("id", id);
  },

  //constructArrays
};

module.exports = GameService;
