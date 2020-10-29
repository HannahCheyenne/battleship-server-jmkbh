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

  checkHit(gameState, x, y) {
    if (gameState.player_turn) {
      const cell = gameState.p2_board[x][y];
      if (cell >= 0 && cell <= 4) {
        //hit!
        gameState.p2_health[cell] -= 1;
        const total_health = gameState.p2_health.reduce(
          (accumulator, currentValue) => accumulator + currentValue
        );
        if (total_health <= 0) gameState.active_game = false; // game over!
        gameState.p2_board[x][y] = 8;
      } else {
        //miss!
        gameState.p2_board[x][y] = 9;
      }
    }
    return gameState;
  },

  checkAiHit(gameState) {
    if (!gameState.player_turn) {
      let validMove = false;
      let x = 0;
      let y = 0;
      let cell;
      let timeout = 100;

      while (!validMove) {
        y = Math.floor(Math.random() * 8);
        x = Math.floor(Math.random() * 8);
        cell = gameState.p1_board[x][y];
        if (cell !== 9 && cell !== 8) {
          validMove = true;
        }

        timeout -= 1;
        if (timeout < 0) {
          //! This should return an error, not valid, this is just for testing
          validMove = true;
        }
      }

      if (cell >= 0 && cell <= 4) {
        //hit!
        gameState.p1_health[cell] -= 1;
        const total_health = gameState.p1_health.reduce((a, c) => a + c);
        if (total_health <= 0) gameState.active_game = false; // game over!
        gameState.p1_board[x][y] = 8;
      } else {
        //miss!
        gameState.p1_board[x][y] = 9;
      }
    }
    return gameState;
  },

  coinFlip() {
    return parseInt(Math.random() * 2) + 1;
  },

  generateBoard() {
    let board = [
      [7, 7, 7, 7, 7, 7, 7, 7],
      [7, 7, 7, 7, 7, 7, 7, 7],
      [7, 7, 7, 7, 7, 7, 7, 7],
      [7, 7, 7, 7, 7, 7, 7, 7],
      [7, 7, 7, 7, 7, 7, 7, 7],
      [7, 7, 7, 7, 7, 7, 7, 7],
      [7, 7, 7, 7, 7, 7, 7, 7],
      [7, 7, 7, 7, 7, 7, 7, 7],
    ];
    let validMove = false;
    let x = 0;
    let y = 0;

    for (let shipId = 4; shipId >= 0; shipId--) {
      board = this.placeShip(board, shipId);
    }
    console.log("generateBoard -> board", board)
    return board;
  },

  shipLength(shipId) {
    if (shipId === 4) {
      return 5;
    } else if (shipId === 3) {
      return 4;
    } else if (shipId === 2) {
      return 3;
    } else if (shipId === 1) {
      return 3;
    } else if (shipId === 0) {
      return 2;
    } else {
      return 0;
    }
  },

  placeShip(board, shipId) {
    const shipLength = this.shipLength(shipId);
    let allClear = true;
    let dirX = 0;
    let dirY = 0;
    const dir = [1, 2, 3, 4];
    let anchorX = 0;
    let anchorY = 0;
    let validAnchor = false;
    let validPlacement = false;

    while (!validPlacement) {
      dirX = 0;
      dirY = 0;
      validAnchor = false;
      while (!validAnchor) {
        anchorX = Math.floor(Math.random() * (9 - shipLength) + shipLength - 1);
        anchorY = Math.floor(Math.random() * (9 - shipLength) + shipLength - 1);
        if (board[anchorX][anchorY] === 7) {
          validAnchor = true;
        }
      }
      if (this.coinFlip() == 1) {
        if (this.coinFlip() == 1) {
          dirX = -1;
        } else {
          dirX = 1;
        }
      } else {
        if (this.coinFlip()) {
          dirY = -1;
        } else {
          dirY = 1;
        }
      }
      for (let i = 0; i < shipLength; i++) {
        let x = anchorX + i * dirX;
        let y = anchorY + i * dirY;
        if (x >= 0 && x <= 7 && y >= 0 && y <= 7) {
          if (board[x][y] !== 7) {
            allClear = false;
          } else {
            allClear = true;
          }
        } else {
          allClear = false;
        }
      }
      if (allClear) {
        validPlacement = true;
        for (let i = 0; i < shipLength; i++) {
          let x = anchorX + i * dirX;
          let y = anchorY + i * dirY;
          board[x][y] = shipId;
        }
      }
    }
    return board;
  },

  test() {
    let testBoard = this.generateBoard();
    return testBoard
  },

  initializeGame(db, newState) {
    let aiBoard = this.generateBoard();
    return db("game_state")
      .insert({
        p1_board: newState.p1_board,
        p2_board: aiBoard,
        p1_health: newState.p1_health,
        p2_health: newState.p2_health,
        player_turn: newState.player_turn,
        active_game: newState.active_game,
      })
      .returning("id");
  },
};

module.exports = GameService;
