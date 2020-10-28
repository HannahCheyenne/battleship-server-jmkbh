/*

Good day!

Here's the basic info. I'm not sure if you're looking to go the extra mile on these
or if you're planning to meet the minimum requirements. I'm personally cool with the 
minimum here. 

Some of these endpoints are subject to change, but if we're keeping it simple, they're 
done enough to test.abs


These endpoints often pass the entire gamestate back and forth. When I refer to one,
typically, I am referring to an object with the following:

        p1_board
        p2_board
        p1_health
        p2_health
        player_turn
        active_game

While a "board" would consist of a 2-dimensional, 8x8 array with the elements x and y

Endpoints:

game/:id 

  GET - returns game state for game ID. This is not used currently, but could come up
    when we implement multiplayer and could help in error trapping
  
  PATCH - gets called when a player makes a move. Takes an x and y coordinate and returns a full game state (you can see what's 
    included on the endpoint) - There's no real way to verify that the info is "correct" other
    than none of it should be undefined?

game/newgame

  POST - takes in a gamestate and returns a gamestate like described above, but with 
    the addition of the new game ID

game/aimove/:id

  PATCH - similar to the game/:id PATCH except that the x and y are generated, returns game state


Note: If we had more time for polish, these endpoints could definitely be made more data-efficient.
  I left it as the full gamestate for flexibility because we were talking about different
  game modes and whatnot. But if I made them more efficient, it will break all the tests,
  so my vote is to keep them as gamestate swaps and don't worry about it. Or just leave me notes
  on what I would need to change if I did. 









*/