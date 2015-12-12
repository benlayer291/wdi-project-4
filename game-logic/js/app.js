$(function(){
  initialize();
})

// Runs on page load
function initialize(){
  timer();
  setupGameGrid();
  setupPlayerGrid(6);
  $('.game-gridsquare').on('click', playGame);
  cpuPlayGame();
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
    $('#'+i).html(gameGrid[i]);
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

    updateScore(gridsquareSelected, true);
    changeGameGrid(gridsquareSelected);
    playerGrid.pop();
    setupPlayerGrid(1);
  } else {
    updateScore(gridsquareSelected, false);
  }
  setTimeout(function(){ gridsquareSelected.css('background', 'none') }, 200);
}

//Update the score of the player upon correct and incorrect choices
function updateScore(gridsquareSelected, value) {
  if (value === true) {
    playerScore++;
    gridsquareSelected.css('background', 'green');
    $('#player-score')
      .html('Score: '+playerScore)
      .css('color', 'green');
    setTimeout(function(){ $('#player-score').css('color', 'black') }, 200);
  } else {
    if (playerScore > 0) playerScore--; 

    gridsquareSelected.css('background', 'red');
    $('#player-score')
      .html('Score: '+playerScore)
      .css('color', 'red');
    setTimeout(function(){ $('#player-score').css('color', 'black') }, 200)
  }
}

//Swap positions on the grid when correct square is clicked
function changeGameGrid(gridsquareSelected) {
  var gridsquareSelectedIndex = parseInt(gridsquareSelected.attr('id'));
  var gridsquareToSwapIndex   = Math.floor(Math.random()*gameGrid.length);

  gridsquareSelected = gameGrid[gridsquareSelectedIndex];
  gameGrid[gridsquareSelectedIndex] = gameGrid[gridsquareToSwapIndex];
  gameGrid[gridsquareToSwapIndex]   = gridsquareSelected;

  $('#'+gridsquareSelectedIndex).html(gameGrid[gridsquareSelectedIndex]);
  $('#'+gridsquareToSwapIndex).html(gameGrid[gridsquareToSwapIndex]);
}

//CPU Player
function cpuClickEvent() {
  var cpuSelectedShape = $('#player-gridsquare-5').html();
  var cpuSelectedShapeIndex = gameGrid.indexOf(cpuSelectedShape);
  return $('#'+cpuSelectedShapeIndex).trigger('click');
}

function cpuPlayGame() {
  setTimeout(function(){
    console.log(gameTime);
    while (gameTime > 0) {
      console.log(gameTime);
      setInterval(cpuClickEvent(), 1000);
    }
  }, 1000);
}

function cpuPlayGame() {
  var max = 15;
  var min = 10;
  var interval = (Math.floor(Math.random() * (max - min + 1)) + min)*100;

  var cpuMove = setInterval(function(){

    if(gameTime > 0) {
      setInterval(cpuClickEvent());
    } else {
      clearInterval(cpuPlayGame);
      $('.game-gridsquare').off('click');
    }
  }, interval);
}