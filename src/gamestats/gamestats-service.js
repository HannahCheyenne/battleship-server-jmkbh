const GameStatsService = {
    getUsersStats(db, user_id) {
      return db
        .from('game_stats')
        .select(
          'game_stats.id',
          'game_stats.game_wins',
          'game_stats.game_losses',
          'game_stats.games_played',
          'game_stats.shots_hit',
          'game_stats.shots_missed',
          'game_stats.carrier_destroyed',
          'game_stats.battleship_destroyed',
          'game_stats.destroyer_destroyed',
          'game_stats.submarine_destroyed',
          'game_stats.patrolboat_destroyed',
          'game_stats.user_id'
        )
        .where('game_stats.user_id', user_id)
        .first();
    },
    updateGameStats(db, data) {
      return db('game_stats')
        .where({ user_id: data.user_id })
        .update({
          game_wins: data.game_wins,
          game_losses: data.game_losses,
          games_played: data.games_played,
          shots_hit: data.shots_hit,
          shots_missed: data.shots_missed,
          carrier_destroyed: data.carrier_destroyed,
          battleship_destroyed: data.battleship_destroyed,
          destroyer_destroyed: data.destroyer_destroyed,
          submarine_destroyed: data.submarine_destroyed,
          partolboat_destroyed: data.partolboat_destroyed
        });
    },
  };
  module.exports = GameStatsService;