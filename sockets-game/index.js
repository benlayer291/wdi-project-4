// Require Express
var express = require('express');
var port    = process.env.PORT || 3000;

// Create a new instance of Express
var app     = express();

// Get the shapeGame backend logic file
var game    = require('./game');

// Create a node.js based http server and state the port to listen to
var http    = require('http').Server(app);

http.listen(port, function(){
  console.log('***listening on localhost:3000***');
});

// Create a socket.io server and relate it to the node.js http server
var io      = require('socket.io')(http);
var players = {};

// Serve front-end html, js, css from the 'public' directory
app.use(express.static(__dirname + '/front-end/public'));

//Listen for socket.io connections, linked to client.js file on frontend
io.on('connection', function(socket){
  // game.initGame(io, socket);
  socket.emit('players', players);
  socket.on('newPlayer', newPlayer);
  socket.on('playerClick', playerClick);

  function newPlayer(player) {
    players[player.id] = player;
    console.log('All players: ', players);
    socket.broadcast.emit('joined', player);
  }

  function playerClick() {

  }

});