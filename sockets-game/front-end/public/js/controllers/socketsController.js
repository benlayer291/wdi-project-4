angular
  .module('shapes')
  .controller('SocketsController', SocketsController)

function SocketsController() {

  var self = this;

  self.init      = init;
  self.start     = start;
  self.join      = join;
  self.inGame    = inGame;
  self.playGame  = playGame;
  self.gameTimer = gameTimer;
  self.setUpPlayerShape = setUpPlayerShape;

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

  function setUpPlayerShape(game) {
    // Setup player-grid, different for each player- comes from client side
    var socketId    = socket.io.engine.id;
    var playerShape = game['main-grid'][(Math.floor(Math.random()*game['main-grid'].length))];

    console.log(playerShape);
    return $('#player-selected-gridsquare').html(playerShape);
  }

  function playGame(){
    var gameId        = $(this).data('gameid');
    var socketId      = socket.io.engine.id;
    var playerShape   = $('#player-selected-gridsquare').html();
    var squareClicked = $(this).html();
    socket.emit('playingGame', gameId, socketId, playerShape, squareClicked);
  }


  function gameTimer() {
    var gameTime = 30;
    
    $('.timer').html('Time: ' + gameTime);
    setTimeout(function(){ $('.notifications').empty() }, 1000)
    var timeRemaining = setInterval(function(){
      if(gameTime > 0) {
        gameTime--;
      } else {
        $('.notifications').append('<li>Game Over!</li>');
        $('.game-gridsquare').off('click');
        clearInterval(timeRemaining);
        // endGame(game);
      }
      $('.timer').html('Time: ' + gameTime);
    }, 1000);
    $('.game-gridsquare').on('click', playGame);
    return gameTime;
  }


}