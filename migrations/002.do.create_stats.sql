CREATE TABLE "game_stats" (
    "id" SERIAL PRIMARY KEY,
    "game_wins" SMALLINT DEFAULT 0,
    "game_losses" SMALLINT DEFAULT 0,
    "games_played" SMALLINT DEFAULT 0,
    "shots_hit" SMALLINT DEFAULT 0,
    "shots_missed" SMALLINT DEFAULT 0,
    "carrier_destroyed" SMALLINT DEFAULT 0,
    "battleship_destroyed" SMALLINT DEFAULT 0,
    "destroyer_destroyed" SMALLINT DEFAULT 0,
    "submarine_destroyed" SMALLINT DEFAULT 0,
    "patrolboat_destroyed" SMALLINT DEFAULT 0,
    "user_id" INTEGER REFERENCES "users"(id)
        ON DELETE CASCADE NOT NULL
);