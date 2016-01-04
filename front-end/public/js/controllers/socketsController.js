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
  self.gameTime         = 30;
  self.cpuShape;

  self.squares     = new Array(9);
  self.getGames    = getGames;
  self.gamesToggle = gamesToggle;
  self.init        = init;
  self.start       = start;
  self.join        = join;
  self.cpuJoin     = cpuJoin;
  self.inGame      = inGame;
  self.playGame    = playGame;
  self.gameTimer   = gameTimer;
  self.cpuPlay     = cpuPlay;

  self.cpuClickEvent    = cpuClickEvent;
  self.setUpCpuShape    = setUpCpuShape;
  self.setUpPlayerShape = setUpPlayerShape;

  function init(){
    console.log('initialising');
    CurrentUser.saveUser(TokenService.decodeToken());
    console.log("current user is",CurrentUser.user);
    $("#notifications").on("click", ".join-game", join);
    $("#notifications").on("click", ".cpu-join-game", cpuJoin);
  };

  function getGames(){
    Game.query(function(data){
      for (var i=0; i<data.games.length; i++){
        if (data.games[i].players.length<2) {
          self.waitingGames.push(data.games[i]);
        }
      }
      if (self.waitingGames.length<1) {
        $("#notifications")
          .append("<li class='chooseGame'>IF NO GAMES, PLAY NEW GAME</li>")
      }
      console.log('Current games to play',self.waitingGames);
      for (var i=0; i<self.waitingGames.length; i++){
        if (self.waitingGames[i].players[0]._id !== CurrentUser.user._id) {
          $("#notifications")
            .append("<li class='chooseGame'>PLAY  " + self.waitingGames[i].players[0].local.firstname+ " "+ self.waitingGames[i].players[0].local.lastname+ "?<a href='#' data-gameid='"+self.waitingGames[i].socket_id+"' class='join-game animated fadeIn'>  JOIN</a></li>");
        }
      }
    });
  }

  function gamesToggle(){
    event.preventDefault();
    console.log('displaying games');
    $('.chooseGame').slideToggle();
  }

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
    $(".new-game-tools").hide();
    return socket.emit('joinedGame', gameId, socketId, self.joiningPlayer);
    // return inGame(gameId);
  }

  function cpuJoin(){
    event.preventDefault();
    console.log($(this).data('gameid'));
    gameId = $(this).data('gameid');
    return socket.emit('cpuJoinedGame', gameId)
  }

  function inGame(gameid){
    $(".new-game-tools").hide();
    $("#notifications")
      .empty()
      .append("<li class='animated fadeIn'>WAITING FOR PLAYER</li><li class='animated fadeIn'>or</li><li class='animated fadeIn'><button type='submit' data-gameid='"+gameid+"' class='btn btn-default new-game-tools cpu-join-game'>PLAY CPU</button></li>")
    return self.gameid;
  }

  function setUpPlayerShape(game){
    // var socketId    = socket.io.engine.id;
    var playerShape = game.grid[(Math.floor(Math.random()*game.grid.length))];
    return $('#player-selected-gridsquare').html(playerShape);
  }

  function setUpCpuShape(game){
    return self.cpuShape = game.grid[(Math.floor(Math.random()*game.grid.length))];
  }

  function playGame(index){
    var gameId        = $('#'+index).data('gameid');
    var socketId      = socket.io.engine.id;
    var player        = CurrentUser.user;
    var playerShape   = $('#player-selected-gridsquare').html();
    var squareClicked = $('#'+index).html();

    return socket.emit('playingGame', gameId, socketId, player, playerShape, squareClicked);
  }

  function gameTimer(game, CPU) {
    // var gameTime = self.gameTime;
    
    $('.timer').html('TIME: ' + self.gameTime);
    setTimeout(function(){ $('#notifications').empty() }, 1000)
    var timeRemaining = setInterval(function(){
      if(self.gameTime > 0) {
        self.gameTime--;
      } else {
        $('.game-gridsquare').off('click');
        clearInterval(timeRemaining);
        if (CPU === true) {
          socket.emit('endGame', game);
        }
        endGame(game);
      }
      $('.timer').html('TIME: ' + self.gameTime);
    }, 1000);
    return timeRemaining;
  }

  function cpuPlay(game) {

    var max      = 20;
    var min      = 15;
    var interval = (Math.floor(Math.random() * (max - min + 1)) + min)*100;

    var cpuMove = setInterval(function(){

      if(self.gameTime > 0) {
        cpuClickEvent(game);
      } else {
        clearInterval(cpuPlay);
        $('.game-gridsquare').off('click');
      }
    }, interval);
  }

  function cpuClickEvent(game) {
    console.log('******', game.players);
    User.get({id: game.players[1]}, function(data){
      var player = data.user;
      var gameId                = game.socket_id;
      var socketId              = socket.io.engine.id;
      // var player                = game.players[1];
      console.log(player)
      var playerShape           = self.cpuShape;
      var cpuSelectedShapeIndex = game.grid.indexOf(playerShape);
      var squareClicked         = $('#'+cpuSelectedShapeIndex).html();
      console.log('CPU clicked', squareClicked);
      console.log(player);
      // return $('#'+cpuSelectedShapeIndex).trigger('click');
      socket.emit('playingGame', gameId, socketId, player, playerShape, squareClicked);
      return setUpCpuShape(game);
    });
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
    }, 400);

    setTimeout(function(){
      console.log(finalScores);
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
    },500);
  // return socket.emit('endGame', game);
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
      console.log("DIFFERENT BROWSER", newGame);
      return getGames();
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
        gameTimer(game, false);
      }
      $('.timer').html('TIME ' + countdownTime);
    }, 1000);

    // Setup main-grid- same for both players, comes from server side
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

  socket.on('cpuStart', function(game){
    var countdownTime = 5;
    console.log("CPU START GAME INFO:", game);
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
        gameTimer(game, true);
        cpuPlay(game);
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
    // Setup player shapes
    setUpPlayerShape(game);
    setUpCpuShape(game);
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