angular
  .module('shapes')
  .controller('SocketsController', SocketsController)

SocketsController.$inject = ['Game', 'Score', 'User', 'TokenService', 'CurrentUser']
function SocketsController(Game, Score, User, TokenService, CurrentUser) {

  var self   = this;
  var socket = io.connect();
  var socketId;
  var gameId;
  var gameChannel;

  self.creatingPlayer   = {};
  self.joiningPlayer    = {};
  self.finalScores      = [];
  self.waitingGames     = [];

  self.squares   = new Array(9);
  self.getGames  = getGames;
  self.init      = init;
  self.start     = start;
  self.join      = join;
  self.inGame    = inGame;
  self.playGame  = playGame;
  self.gameTimer = gameTimer;

  self.setUpPlayerShape = setUpPlayerShape;

  function getGames(){
    Game.query(function(data){
      for (var i=0; i<data.games.length; i++){
        if (data.games[i].players.length<2) {
          self.waitingGames.push(data.games[i]);
        }
      }
      console.log(self.waitingGames);
      for (var i=0; i<self.waitingGames.length; i++){
        if (self.waitingGames[i].players[0]._id !== CurrentUser.user._id) {
          $("#notifications").append("<li>PLAY  " + self.waitingGames[i].players[0].local.firstname+ " "+ self.waitingGames[i].players[0].local.lastname+ "?<a href='#' data-gameid='"+self.waitingGames[i].socket_id+"' class='join-game animated fadeIn'>  JOIN</a></li>");
        }
      }
    });
  }

  function init(){
    console.log('initialising');
    CurrentUser.saveUser(TokenService.decodeToken());
    console.log("current user is",CurrentUser.user);
    $("#notifications").on("click", ".join-game", join);
  };

  function start(){
    event.preventDefault();
    socketId = socket.io.engine.id;
    self.creatingPlayer = CurrentUser.user;
    console.log("creating player is", self.creatingPlayer);
    return socket.emit('newGame', socketId, self.creatingPlayer);
  }
  // GAMEID BEING DEFINED FOR FIRST TIME NOW THAT BOTH HAVE JOINED
  function join(){
    event.preventDefault();
    socketId = socket.io.engine.id;
    gameId = $(this).data('gameid');
    self.joiningPlayer = CurrentUser.user;
    socket.emit('joinedGame', gameId, socketId, self.joiningPlayer);
    return inGame(gameId);
  }

  function inGame(gameid){
    // $(".game-list").hide();
    $(".new-game-tools").hide();
    // $(".message").html("<h2>You are playing in game: "+gameid+"</h2>");
    $("#notifications")
      .empty()
      .append("<p class='animated fadeIn'>WAITING FOR PLAYER</p>")
    return self.gameid;
  }

  function setUpPlayerShape(game) {
    var socketId    = socket.io.engine.id;
    var playerShape = game.grid[(Math.floor(Math.random()*game.grid.length))];

    return $('#player-selected-gridsquare').html(playerShape);
  }

  function playGame(index){
    var gameId        = $('#'+index).data('gameid');
    var socketId      = socket.io.engine.id;
    var player        = CurrentUser.user;
    var playerShape   = $('#player-selected-gridsquare').html();
    var squareClicked = $('#'+index).html();

    return socket.emit('playingGame', gameId, socketId, player, playerShape, squareClicked);
  }

  function gameTimer(game) {
    var gameTime = 30;
    
    $('.timer').html('TIME: ' + gameTime);
    setTimeout(function(){ $('#notifications').empty() }, 1000)
    var timeRemaining = setInterval(function(){
      if(gameTime > 0) {
        gameTime--;
      } else {
        $('.game-gridsquare').off('click');
        clearInterval(timeRemaining);
        endGame(game);
      }
      $('.timer').html('TIME: ' + gameTime);
    }, 1000);
    return timeRemaining;
  }

  function endGame(game) {
    var endGame;
    var finalScores = [];
    Game.get({id:game._id}, function(data){
      endGame = data.game
    })

    setTimeout(function(){
      console.log(endGame.scores);
      for(var i=0; i< endGame.scores.length; i++) {
        Score.get({id: endGame.scores[i]}, function(data){
          finalScores.push(data.score.value);
        })
      }
    }, 100)

    setTimeout(function(){
      for (var i =0; i < finalScores.length-1; i++) {
        if (finalScores[i] === finalScores[i+1]) {
          console.log('draw')
          $('#notifications')
          .empty()
          .append('<li class="animated fadeIn">DRAW</li>');
        } else if (finalScores[i] > finalScores[i+1]) {
          console.log('screen 1 wins');
          console.log(CurrentUser.user);
          console.log(endGame.players[i]);
          if (CurrentUser.user._id === endGame.players[i]._id) {
            $('#notifications')
            .empty()
            .append('<li class="animated fadeIn">YOU WIN</li>');
          } else {
            $('#notifications')
            .empty()
            .append('<li class="animated fadeIn">YOU LOSE</li>');
          }
        } else {
          console.log('screen 2 wins');
          if (CurrentUser.user._id === endGame.players[i]._id) {
            $('#notifications')
            .empty()
            .append('<li class="animated fadeIn">YOU LOSE</li>');
          } else {
            $('#notifications')
            .empty()
            .append('<li class="animated fadeIn">YOU WIN</li>');
          }
        }
      }
    },200)
  }


  //SOCKET LISTENING EVENTS
  socket.on('connect', function(){
    console.log('connected', socket.io.engine.id);
    return getGames();
  });

  socket.on('addToListOfGames', function(newGame){
    console.log("Game data received from socket.on:addToListOfGames ", newGame.socket_id);

    if (socket.io.engine.id === newGame.socket_id) {
      return inGame(newGame.socket_id)
    } else {
      console.log("DIFFERENT BROWSER", newGame.players);
      return $("#notifications")
        .empty()
        .append("<li>PLAY  " + newGame.players[0]+"?<a href='#' data-gameid='"+newGame.socket_id+"' class='join-game animated fadeIn'>  JOIN</a></li>");
      // return $(".game-list").html("Game: "+newGame.socket_id+"<span> Players: "+newGame.players.length+"</span><a href='#' data-gameid='"+newGame.socket_id+"' class='join-game'> Join</a></li>");
    }
  })

  socket.on('start', function(game){
    var countdownTime = 5;
    console.log("START GAME INFO:", game);
    // Countdown Timer
    $('#notifications')
      .empty()
      .append('<li>GET READY</li>');
    $('.timer').html('TIME: ' + countdownTime);
    var countdownRemaining = setInterval(function(){
      if(countdownTime > 0) {
        countdownTime--;
      } else {
        $('#notifications')
          .empty()
          .append('<li>GO!</li>');
        clearInterval(countdownRemaining);
        gameTimer(game);
      }
      $('.timer').html('TIME ' + countdownTime);
    }, 1000);

    // Setup main-grid when timer finishes- same for both players, comes from server side
    for (var i = 0; i < game.grid.length; i++) {
      $('#'+i)
        .html(game.grid[i])
        .attr('data-gameid', game.socket_id);
    }

    // Setup scores with player socket ids
    for (var i = 0; i < game.players.length-1; i++) {
      $('#score-1')
        .empty()
        .append('<li class="animated fadeIn" id=score-'+game.players[i]+'>SCORE: 0</li>');
      $('#score-2')
        .empty()
        .append('<li class="animated fadeIn" id=score-'+game.players[i+1]+'>SCORE: 0</li>');
    }

    return setUpPlayerShape(game);
  });

  socket.on('correctChoice', function(game, socketId, score){

    // Update the main grid
    for (var i = 0; i < game.grid.length; i++) {
      $('#'+i)
      .html(game.grid[i])
      .attr('data-gameid', game.socket_id);
    }

    // Player gets a new shape
    if (socketId === socket.io.engine.id) {
      var playerShape = game.grid[(Math.floor(Math.random()*game.grid.length))];
      $('#player-selected-gridsquare').html(playerShape);
    }

    // Player gets a point
    $('#score-'+score.player).html('SCORE: ' + score.value);
  })

  return self.init();

}