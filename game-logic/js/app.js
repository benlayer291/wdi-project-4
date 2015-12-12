$(function(){
  console.log('working');
  initialize();
})

// Runs on page load
function initialize(){
  timer();
  setupGameGrid();
  setupPlayerGrid(6);
  $('.game-gridsquare').on('click', playGame)
}

// Variables
var shapes       = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];
var gameGridsize = Math.pow(3,2);
var gameGrid     = [];
var playerGrid   = [];
var playerScore  = 0;
var gameTime     = 30;

// Timer function
function timer() {
  $('#timer').html('Time: ' + gameTime);
  var timeRemaining = setInterval(function(){
    if(gameTime > 0) {
      gameTime--;
    } else {
      clearInterval(timeRemaining);
      $('.game-gridsquare').off('click');
    }
    $('#timer').html('Time: ' + gameTime);
  }, 1000);
}

//Setup game grid and player grid
function setupGameGrid(){

  for (var i = 0; i < gameGridsize; i++) {

    var shape = shapes[Math.floor(Math.random()*shapes.length)];
    var shapeIndex = shapes.indexOf(shape);
    
    gameGrid.push(shape);
    shapes.splice(shapeIndex, 1);
  }

  for (var i = 0; i < gameGridsize; i++) {
    $('#game-gridsquare-'+i).html(gameGrid[i]);
  }
  shapes = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];
  return gameGrid;
}

function setupPlayerGrid(number) {

  for (var i=0; i<number; i++) {
    var shape = shapes[Math.floor(Math.random()*shapes.length)];
    playerGrid.unshift(shape);
  }

  for (var i = 0; i < gameGridsize; i++) {
    $('#player-gridsquare-'+i).html(playerGrid[i]);
  }
  return playerGrid;
}

//Game play function upon square click
function playGame() {
  var gridsquareSelected = $(this);
  var playerSelected     = $('#player-gridsquare-5');

  if (gridsquareSelected.html() === playerSelected.html()) {
    gridsquareSelected.css('background', 'green');
    playerScore++;
    updateScore(playerScore, 'green');
    playerGrid.pop();
    setupPlayerGrid(1);
  } else {
    gridsquareSelected.css('background', 'red');
    if (playerScore > 0) { playerScore--; }
    updateScore(playerScore, 'red');
  }
  setTimeout(function(){ gridsquareSelected.css('background', 'none') }, 200);
}

function updateScore(playerScore, color) {
  $('#player-score')
    .html('Score: '+playerScore)
    .css('color', color)
  setTimeout(function(){ $('#player-score').css('color', 'black') }, 200)
}

