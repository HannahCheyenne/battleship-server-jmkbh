const GameService = {
  getGameState(db) {
    return db
      .from('game_state')
      .select(
        'p1_board',
        'p2_board',
        'p1_health',
        'p1_health',
        'player_turn',
        'active_game',
      )
  },
  
  //constructArrays



};
module.exports = GameService;