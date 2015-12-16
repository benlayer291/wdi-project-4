angular
  .module('shapes')
  .controller('SocketsController', SocketsController)

function SocketsController() {

  var self   = this;
  var socket = io.connect();
  var gameChannel;

  self.init      = init;
  self.start     = start;
  self.join      = join;
  self.inGame    = inGame;
  self.playGame  = playGame;
  self.gameTimer = gameTimer;
  self.setUpPlayerShape = setUpPlayerShape;

  function init(){
    console.log('initialising');
    $("form").on("submit", start);
    $(".game-list").on("click", ".join-game", join);
  };

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

  socket.on('start', function(game){
    var countdownTime = 5;

    // Countdown Timer
    $('.notifications').append('<li>Get Ready!</li>');
    $('.timer').html('Time: ' + countdownTime);
    var countdownRemaining = setInterval(function(){
      if(countdownTime > 0) {
        countdownTime--;
      } else {
        $('.notifications')
          .empty()
          .append('<li>Go!</li>');
        clearInterval(countdownRemaining);
        gameTimer();
      }
      $('.timer').html('Time: ' + countdownTime);
    }, 1000);

    // Setup main-grid when timer finishes- same for both players, comes from server side
    for (var i = 0; i < game['main-grid'].length; i++) {
      $('#'+i)
        .html(game['main-grid'][i])
        .attr('data-gameid', game.id);
    }

    // Setup scores with player socket ids
    for (var i = 0; i < game.players.length; i++) {
      $('.score').append('<li id=score-'+game.players[i].id+'>Score:'+game.players[i].score+'</li>')
    }

    return setUpPlayerShape(game);
  });

  socket.on('correctChoice', function(game, socketId){

    // Update the main grid
    for (var i = 0; i < game['main-grid'].length; i++) {
      $('#'+i)
      .html(game['main-grid'][i])
      .attr('data-gameid', game.id);
    }

    // Player gets a new shape
    if (socketId === socket.io.engine.id) {
      var playerShape = game['main-grid'][(Math.floor(Math.random()*game['main-grid'].length))];
      console.log(playerShape);
      $('#player-selected-gridsquare').html(playerShape);
    }

    // Player gets a point
    console.log("SCORES: ", game.players);
    for (var i = 0; i < game.players.length; i++) {
      console.log(game.players[i]);
      $('#score-'+game.players[i].id).html('Score: '+ game.players[i].score);
    }
  })

return init();
}