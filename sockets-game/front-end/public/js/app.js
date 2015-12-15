// // sending to sender-client only
// socket.emit('message', "this is a test");

// // sending to all clients, include sender
// io.emit('message', "this is a test");

// // sending to all clients except sender
// socket.broadcast.emit('message', "this is a test");

// // sending to all clients in 'game' room(channel) except sender
// socket.broadcast.to('game').emit('message', 'nice game');

// // sending to all clients in 'game' room(channel), include sender
// io.in('game').emit('message', 'cool game');

// // sending to sender client, only if they are in 'game' room(channel)
// socket.to('game').emit('message', 'enjoy the game');

// // sending to all clients in namespace 'myNamespace', include sender
// io.of('myNamespace').emit('message', 'gg');

// // sending to individual socketid (server-side)
// socket.broadcast.to(socketid).emit('message', 'for your eyes only');

// // join to subscribe the socket to a given channel (server-side):
// socket.join('some room');

// // then simply use to or in (they are the same) when broadcasting or emitting (server-side)
// io.to('some room').emit('some event'):

// // leave to unsubscribe the socket to a given channel (server-side)
// socket.leave('some room');

var socket      = io.connect();
var gameChannel;

$(function(){
  $("form").on("submit", start);
  $(".game-list").on("click", ".join-game", join);
});

function start(){
  event.preventDefault();
  socket.emit('newGame', socket.io.engine.id);
}

function join(){
  event.preventDefault();
  var gameId = $(this).data('gameid');
  socket.emit('joinedGame', gameId, socket.io.engine.id)
  return inGame(gameId)
}

function inGame(gameid){
  $(".game-list").hide();
  $(".new-game-tools").hide();
  return $(".message").html("<h2>You are playing in game: "+gameid+"</h2>")
}

function playGame(){
  console.log(socket.io.engine.id, ' just clicked ', $(this).html(), ' square');
  socket.emit('playingGame', socket.io.engine.id, $(this).html());
}

//SOCKET LISTENING EVENTS
socket.on('connect', function(){
  console.log('connected', socket.io.engine.id);
});

socket.on('addToListOfGames', function(game){
  console.log("Game data received from socket.on:addToListOfGames ", game);

  if (socket.io.engine.id === game.id) {
    return inGame(game.id)
  } else {
    return $(".game-list").append("<li>"+game.id+"<span>Players: "+game.players.length+"</span><a href='#' data-gameid='"+game.id+"' class='join-game'>Join</a></li>");
  }
})

// ROOM ACTIONS
// Start
// Finish
// Each player moves
// Disappear of shape
// Player scores increment

socket.on('start', function(game){
  console.log(game);
  console.log(game['main-grid']);
  // Timer

  // Setup main-grid when timer finishes- same for both players, comes from server side
  for (var i = 0; i < game['main-grid'].length; i++) {
    $('#'+i).html(game['main-grid'][i]);
  }
  // Setup player-grid when timer finishes- different for each player, comes from client side
  var playerGrid = [];
  var playerShape = game['main-grid'][(Math.floor(Math.random()*game['main-grid'].length))];
  playerGrid.push(playerShape);
  console.log(playerShape);
  $('#player-selected-gridsquare').html(playerShape);
  return $('.game-gridsquare').on('click', playGame);
})
