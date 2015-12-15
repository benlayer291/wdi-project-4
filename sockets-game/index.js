// Require Express
var express = require('express');
var port    = process.env.PORT || 3000;

// Create a new instance of Express
var app     = express();

// Create a node.js based http server and state the port to listen to
var http    = require('http').Server(app);

http.listen(port, function(){
  console.log('***listening on localhost:3000***');
});

// Serve front-end html, js, css from the 'public' directory
app.use(express.static(__dirname + '/front-end/public'));

// Create a socket.io server and relate it to the node.js http server
var io       = require('socket.io')(http);
var games    = {};
var player   = {};
var gameRoom;

//Listen for socket.io connections, linked to client.js file on frontend
io.on('connection', function(socket){
  socket.on("newGame", function(socketId){
    console.log("Game started with id: ", socketId);
    // If new game, create new game in database? The object below is like model in database
    games[socketId] = {
      id: socketId,
      players: []
    }
    // Save player
    player[socketId] = {
      id: socketId,
      score: 0
    }
    games[socketId].players.push(player[socketId]);
    // Add to list of games
    io.emit("addToListOfGames", games[socketId]);
    // Join new room for that game
    gameRoom = "game_"+socketId;
    socket.join(gameRoom);
  });

  socket.on("joinedGame", function(gameId, socketId) {
    var game = games[gameId];
    // Save player
    player[socketId] = {
      id: socketId,
      // name: req.body.name,
      score: 0
    }
    game.players.push(player[socketId]);
    // Send to all members of that game updating that a new player has joined
    socket.join(gameRoom);
    console.log(socketId, " just joined the game ", game);
    // Setup main-grid on server side to be pushed to both players on the client side
    var shapes = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];
    game['main-grid'] = [];

    for (var i = 0; i < 9; i++) {
      var shape = shapes[Math.floor(Math.random()*shapes.length)];
      var shapeIndex = shapes.indexOf(shape);
      game['main-grid'].push(shape);
      shapes.splice(shapeIndex, 1);
    }
    // Send information about the game to the gameRoom on the client side
    gameRoom = "game_"+gameId;
    io.to(gameRoom).emit('start', game);
  })

  // socket.on("playerGridSquare", function(socketId, playerShape) {
  //   console.log(socketId, "'s loaded shape is: ", playerShape);
  // })

socket.on("playingGame", function(gameId, socketId, playerShape, squareClicked){
    // console.log (socketId, " just clicked ", squareClicked, ' in this game: ', gameId);

    var game        = games[gameId];
    var gameGrid    = game['main-grid'];

    //correct choice
    if (playerShape === squareClicked) {
      console.log(socketId, ' got the grid choice correct!')
      var squareClickedIndex = gameGrid.indexOf(squareClicked);
      var squareToSwapIndex  = Math.floor(Math.random()*gameGrid.length);
      // change the grid
      gameGrid[squareClickedIndex] = gameGrid[squareToSwapIndex];
      gameGrid[squareToSwapIndex]  = squareClicked;
      // change the score
      for (var i = 0; i < game.players.length; i++) {
        if (game.players[i].id === socketId) {
          game.players[i].score++;
        }
      }
      //send to front-end
      console.log('PLAYERS SCORES:', game.players);
      io.to(gameRoom).emit('correctChoice', game, socketId);
    } else {
      io.to(gameRoom).emit('incorrectChoice', game, socketId);
    }
  })

socket.on("endGame", function(game){
  console.log("Game that is ending", games[game.id]);
  io.to(gameRoom).emit('checkWinner');
})

});