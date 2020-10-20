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
        'active_game',
      )
      .where(
        'id', id
      )
  },
  
  postGameState(db, newState) {

    return db
    .insert(newState)
    .into('game_state')
    .returning('*')

},


postNewGame(db){  
  
  
  return db
  .from('game_state')
  .select(
    'id',
    'p1_board',
      'p2_board',
      'p1_health',
      'p2_health',
      'player_turn',
      'active_game',
      )
    .where(
      'id', id
    )
  }

  
  //constructArrays
  
};



module.exports = GameService;