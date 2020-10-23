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
        console.log('postGameState -> newState', newState.p2_board);
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
                console.log('checkHit -> gameState.active_game', gameState.active_game);
                gameState.p2_board[x][y] = 8;
            } else {
                //miss!
                gameState.p2_board[x][y] = 9;
            }
        } else {
            //!doAIMove
        }

        return gameState;
    },

    initializeGame(db, newState) {
        console.log('initializeGame -> newState', newState);
        return db('game_state')
            .insert({
                p1_board: newState.p1_board,
                p2_board: newState.p2_board,
                p1_health: newState.p1_health,
                p2_health: newState.p2_health,
                player_turn: newState.player_turn,
                active_game: newState.active_game,
            })
            .returning('id');
    },
};

module.exports = GameService;
