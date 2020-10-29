const AiGameService = {

    //gets AI board to send to client
    getAiBoard(db, id) {
        return db
            .from('ai_boards')
            .select(
                'id',
                'ai_board'
            )
            .where('id', id)
    },
    //insert a new game with a clean board to db and return it
    initializeGameState(db, newState) {
        //1st set of data in the table is a clean board so it is always empty
        let aiBoard = this.getAiBoard(db, 0);
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
    //gets game state from db
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
            .where('id', id)
            .first();
    },
    //updates game state in db
    updateGameState(db, newState) {
        return db
            .from('game_state')
            .update({
                p1_board: newState.p1_board,
                p2_board: newState.p2_board,
                p1_health: newState.p1_health,
                p2_health: newState.p2_health,
                player_turn: newState.player_turn,
                active_game: newState.active_game,
            })
            .where({ id: newState.id })
    },
    //checks if client shot hit
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
    //checks if Ai shot hit
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


}