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
var io      = require('socket.io')(http);
var games   = {};

//Listen for socket.io connections, linked to client.js file on frontend
io.on('connection', function(socket){
  socket.on("newGame", function(socketId){
    console.log("Game started with id: ", socketId);
    // If new game, create new game in database?
    games[socketId] = {
      id: socketId,
      players: []
    }
    // Save player
    games[socketId].players.push(socketId);
    // Add to list of games
    io.emit("addToListOfGames", games[socketId]);
  });

  socket.on("joinedGame", function(gameId, socketId) {
    var game = games[gameId];
    game.players.push(socketId)
    console.log(socketId, " just joined the game ", games[gameId]);
    // Send to all members of that game updating that a new player has joined
    io.emit('game_'+gameId);
  })
});