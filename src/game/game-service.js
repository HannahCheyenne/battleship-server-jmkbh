const GameStatsService = require("../gamestats/gamestats-service");

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
      .where("id", id)
      .first();
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

  checkHit(gameState, x, y, stats) {
    if (gameState.player_turn) {
      const cell = gameState.p2_board[x][y];
      if (cell >= 0 && cell <= 4) {
        //stats.shots_hit += 1;
        gameState.p2_health[cell] -= 1;
        if (gameState.p2_health[cell] <= 0) {
          if (cell === 0) {
            //stats.patrolboat_destroyed += 1;
          } else if (cell === 1) {
            //stats.submarine_destroyed += 1;
          } else if (cell === 2) {
            //stats.destroyer_destroyed += 1;
          } else if (cell === 3) {
            //stats.battleship_destroyed += 1;
          } else if (cell === 4) {
            //stats.carrier_destroyed += 1;
          }
        }
        const total_health = gameState.p2_health.reduce(
          (accumulator, currentValue) => accumulator + currentValue
        );
        if (total_health <= 0) {
          //stats.games_played += 1;
          //stats.game_wins += 1;
          gameState.active_game = false;
        }
        gameState.p2_board[x][y] = 8;
        gameState.player_turn = false;
      } else if (cell === 7) {
        //stats.shots_missed += 1;
        gameState.p2_board[x][y] = 9;
        gameState.player_turn = false;
      } 
    }
    gameState.player_turn = false;
    return [gameState, stats];
  },

  checkAiHit(gameState, stats, x, y) {
    if (!gameState.player_turn) {

      let cell = gameState.p1_board[x][y]


      if (cell >= 0 && cell <= 4) {
        //hit!
        gameState.p1_health[cell] -= 1;
        const total_health = gameState.p1_health.reduce((a, c) => a + c);
        if (total_health <= 0) {
          //stats.games_played += 1;
          //stats.game_losses += 1;
          gameState.active_game = false;
        }
        gameState.p1_board[x][y] = 8;
      } else {
        //miss!
        gameState.p1_board[x][y] = 9;
      }
    }
    return [gameState, stats];
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
    // console.log("generateBoard -> board", board);
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
      allClear = true;
      dirX = 0;
      dirY = 0;
      validAnchor = false;
      while (!validAnchor) {
        anchorX = Math.floor(Math.random() * 8); //(9 - shipLength) + shipLength - 1);
        anchorY = Math.floor(Math.random() * 8); //(9 - shipLength) + shipLength - 1);
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

  setMPBoard(gameState, newBoard) {
    if (newBoard.player === 1) {
      //update p1_board and health
      gameState.p1_board = newBoard.board;
      gameState.p1_health = newBoard.health;
    } else if (newBoard.player === 2) {
      //update p2_board and health
      gameState.p2_board = newBoard.board;
      gameState.p1_health = newBoard.health;
    }

    if (gameState.p1_health[0] === 2 && gameState.p2_health[0] === 2) {
      gameState.active_game = true;
    }

    return db("game_state").insert({
      p1_board: gameState.p1_board,
      p2_board: gameState.p2_board,
      p1_health: gameState.p1_health,
      p2_health: gameState.p2_health,
      active_game: gameState.active_game,
    });
  },

  initializeMPGame(db) {
    let initialBoard = {
      p1_board: [
        [7, 7, 7, 7, 7, 7, 7, 7],
        [7, 7, 7, 7, 7, 7, 7, 7],
        [7, 7, 7, 7, 7, 7, 7, 7],
        [7, 7, 7, 7, 7, 7, 7, 7],
        [7, 7, 7, 7, 7, 7, 7, 7],
        [7, 7, 7, 7, 7, 7, 7, 7],
        [7, 7, 7, 7, 7, 7, 7, 7],
        [7, 7, 7, 7, 7, 7, 7, 7],
      ],
      //opponent
      p2_board: [
        [7, 7, 7, 7, 7, 7, 7, 7],
        [7, 7, 7, 7, 7, 7, 7, 7],
        [7, 7, 7, 7, 7, 7, 7, 7],
        [7, 7, 7, 7, 7, 7, 7, 7],
        [7, 7, 7, 7, 7, 7, 7, 7],
        [7, 7, 7, 7, 7, 7, 7, 7],
        [7, 7, 7, 7, 7, 7, 7, 7],
        [7, 7, 7, 7, 7, 7, 7, 7],
      ],
      p1_health: [0, 0, 0, 0, 0],
      p2_health: [0, 0, 0, 0, 0],
      active_game: false,
    };

    return db("game_state")
      .insert({
        p1_board: initialBoard.p1_board,
        p2_board: initialBoard.p2_board,
        p1_health: initialBoard.p1_health,
        p2_health: initialBoard.p2_health,
        active_game: initialBoard.active_game,
      })
      .returning("id");
  },
};

module.exports = GameService;
