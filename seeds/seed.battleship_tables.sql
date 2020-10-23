BEGIN;

TRUNCATE 
    "game_stats",
    "user",
    "game_state";

INSERT INTO "user" ("id","username","name","password")
VALUES
    (    
        1,
        'admin',
        'Dunder Mifflin Admin',
        -- password = "pass"
        '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG'),
(
        2,
        'demo',
        'demo account',
        -- password = "pass",
    '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG'
    ),
(
        3,
        'quickgame',
        'quickgame',
        -- password = "pass",
    '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG'
    );

INSERT INTO "game_stats" ("id", "game_wins", "game_losses", "games_played", "shots_hit", "shots_missed", "carrier_destroyed", "battleship_destroyed", "destroyer_destroyed", "submarine_destroyed", "patrolboat_destroyed", "user_id")
VALUES
    (1, 2, 2, 4, 25, 2, 2, 3, 2, 3, 2, 1),
    (2, 2, 2, 4, 25, 2, 2, 3, 2, 3, 2, 2),
    (3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3);

INSERT INTO "game_state" ("id", "p1_board", "p2_board", "p1_health", "p2_health", "player_turn", "active_game")
VALUES
(1, 
        '{
        {7, 7, 7, 7, 7, 7, 7, 7},
        {7, 0, 0, 7, 7, 7, 7, 7},
        {7, 7, 7, 7, 2, 7, 7, 7},
        {4, 7, 7, 7, 2, 7, 7, 7},
        {4, 7, 1, 7, 2, 7, 7, 7},
        {4, 7, 1, 7, 7, 7, 7, 7},
        {4, 7, 1, 3, 3, 3, 3, 7},
        {4, 7, 7, 7, 7, 7, 7, 7}
        }',
    
        '{
        {7, 7, 7, 7, 7, 7, 7, 7},
        {7, 0, 0, 7, 7, 7, 7, 7},
        {7, 7, 7, 7, 2, 7, 7, 7},
        {4, 7, 7, 7, 2, 7, 7, 7},
        {4, 7, 1, 7, 2, 7, 7, 7},
        {4, 7, 1, 7, 7, 7, 7, 7},
        {4, 7, 1, 3, 3, 3, 3, 7},
        {4, 7, 7, 7, 7, 7, 7, 7}
        }',

    '{2,3,3,4,5}',
    '{2,3,3,4,5}',
    true,
    true
);


SELECT setval('game_stats_id_seq', (SELECT MAX(id) from "game_stats"));
SELECT setval('game_state_id_seq', (SELECT MAX(id) from "game_state"));
SELECT setval('user_id_seq', (SELECT MAX(id) from "user"));

COMMIT;