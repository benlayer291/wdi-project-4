$(function(){
  console.log('working');
  initialize();
})

function initialize(){
  setupGameGrid();
  setupPlayerGrid(6);
  $('.game-gridsquare').on('click', playGame)
}

// Need to assign shapes to game-gridsquares

var shapes       = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];
var gameGridsize = Math.pow(3,2);
var gameGrid     = [];
var playerGrid   = [];
var playerScore  = 0;

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

function playGame() {
  var gridsquareSelected = $(this);
  var playerSelected     = $('#player-gridsquare-5');

  if (gridsquareSelected.html() === playerSelected.html()) {
    gridsquareSelected.css('background', 'green');
    playerScore++;
    playerGrid.pop();
    setupPlayerGrid(1);
  } else {
    gridsquareSelected.css('background', 'red');
    playerScore--;
  }
  setTimeout(function(){ gridsquareSelected.css('background', 'none') }, 200);
}

