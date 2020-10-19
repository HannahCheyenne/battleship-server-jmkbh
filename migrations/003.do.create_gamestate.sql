CREATE TABLE "game_state" (
    "id" SERIAL PRIMARY KEY,
    "p1_board" INTEGER[][],
    "p2_board" INTEGER[][],
    "p1_health" INTEGER[],
    "p2_health" INTEGER[],
    "player_turn" BOOLEAN,
    "active_game" BOOLEAN
);