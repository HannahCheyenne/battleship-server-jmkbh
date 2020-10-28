const GameService = {
    getGameState(db, id) {
        return db
            .from('game_state')
            .select(
                'id',
                'p1_board',
                'p2_board',
                'p1_health',
                'p2_health',
                'player_turn',
                'active_game'
            )
            .where('id', id);
    },

    postGameState(db, newState) {
        return db('game_state').where({ id: newState.id }).update({
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
            y = Math.floor(Math.random() * 7) + 1;
            x = Math.floor(Math.random() * 7) + 1;

            let dirX = 0;
            let dirY = 0;
            if (this.coinFlip()) {
                dirX = parseInt(Math.floor(Math.random() * 3)) - 1;
            } else {
                dirY = parseInt(Math.floor(Math.random() * 3)) - 1;
            }

            board = this.checkCells(x, y, dirX, dirY, board, shipId);

            console.log('generateBoard -> board', board);
        }

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

    checkCells(anchorX, anchorY, dirX, dirY, board, shipId) {
        const shipLength = this.shipLength(shipId);
        let allClear = true;
        for (let i = 0; i < shipLength; i++) {
            let x = anchorX + i * dirX;
            let y = anchorY + i * dirY;
            if (x >= 0 && x <= 7 && y >= 0 && y <= 7) {
                if (board[x][y] !== 7) {
                    allClear = false;
                }
            } else {
                allClear = false;
            }
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
    //TODO return data from database
    // let board = [
    //   [7, 7, 7, 7, 7, 7, 7, 7],
    //   [7, 7, 7, 7, 7, 7, 7, 7],
    //   [7, 7, 7, 7, 7, 7, 7, 7],
    //   [7, 7, 7, 7, 7, 7, 7, 7],
    //   [7, 7, 7, 7, 7, 7, 7, 7],
    //   [7, 7, 7, 7, 7, 7, 7, 7],
    //   [7, 7, 7, 7, 7, 7, 7, 7],
    //   [7, 7, 7, 7, 7, 7, 7, 7],
    // ];
    // let validMove = false;
    // let x = 0;
    // let y = 0;

    // for (let shipId = 4; shipId >= 0; shipId--) {
    //   y = Math.floor(Math.random() * 7) + 1;
    //   x = Math.floor(Math.random() * 7) + 1;

    //   let dirX = 0;
    //   let dirY = 0;
    //   if (this.coinFlip()) {
    //     dirX = parseInt(Math.floor(Math.random() * 3)) - 1;
    //   } else {
    //     dirY = parseInt(Math.floor(Math.random() * 3)) - 1;
    //   }
    //   board = this.checkCells(x, y, dirX, dirY, board, shipId);

    //   // console.log("generateBoard -> board", board);
    // }
    // return board;



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

  checkCells(anchorX, anchorY, dirX, dirY, board, shipId) {
    const shipLength = this.shipLength(shipId);
    let allClear = true;
    for (let i = 0; i < shipLength; i++) {
      let x = anchorX + i * dirX;
      let y = anchorY + i * dirY;
      if (x >= 0 && x <= 7 && y >= 0 && y <= 7) {
        if (board[x][y] !== 7) {
          allClear = false;
        }
      } else {
        allClear = true;
      }
    }
    if (allClear) {
      for (let i = 0; i < shipLength; i++) {
        let x = anchorX + i * dirX;
        let y = anchorY + i * dirY;
        board[x][y] = shipId;
      }
    } else {
      y = Math.floor(Math.random() * 7) + 1;
      x = Math.floor(Math.random() * 7) + 1;
      for (let i = 0; i < shipLength; i++) {
        let x = anchorX + i * dirX;
        let y = anchorY + i * dirY;
        board[x][y] = shipId;
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
        if (allClear) {
            for (let i = 0; i < shipLength; i++) {
                let x = anchorX + i * dirX;
                let y = anchorY + i * dirY;
                board[x][y] = shipId;
            }
        }
        return board;
    },

    initializeGame(db, newState) {
        let aiBoard = this.generateBoard();
        return db('game_state')
            .insert({
                p1_board: newState.p1_board,
                p2_board: aiBoard,
                p1_health: newState.p1_health,
                p2_health: newState.p2_health,
                player_turn: newState.player_turn,
                active_game: newState.active_game,
            })
            .returning('id');
    },
};

module.exports = GameService;
