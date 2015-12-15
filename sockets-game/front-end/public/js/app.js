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

// // sending to individual socketid
// socket.broadcast.to(socketid).emit('message', 'for your eyes only');

// // join to subscribe the socket to a given channel:
// socket.join('some room');

// // then simply use to or in (they are the same) when broadcasting or emitting:
// io.to('some room').emit('some event'):

// // leave to unsubscribe the socket to a given channel:
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

  // Not DRY
  gameChannel = 'game_' + socket.io.engine.id;
  setupGameChannel()
}

function join(){
  event.preventDefault();
  var gameId = $(this).data('gameid');
  socket.emit('joinedGame', gameId, socket.io.engine.id)

  // Not DRY
  gameChannel = 'game_' + gameId;
  setupGameChannel()
}

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

function setupGameChannel(){
  socket.on(gameChannel, function(){
    console.log("TESTING");
  })
}


function inGame(gameid){
  $(".game-list").hide();
  return $(".message").html("<h2>You are playing in game: "+gameid+"</h2>")
}