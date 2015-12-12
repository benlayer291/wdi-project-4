$(function(){
  initialize();
})

// Runs on page load
function initialize(){
  timer();
  setupGameGrid();
  setupPlayerGrid(6);
  setupCpuGrid(6);
  $('.game-gridsquare').on('click', playGame);
  setTimeout(cpuPlayGame, 500);
}

// Variables
var shapes       = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];
var gameGridsize = Math.pow(3,2);
var gameGrid     = [];
var playerGrid   = [];
var cpuGrid      = [];
var playerScore  = 0;
var cpuScore     = 0;
var gameTime     = 30;

// Timer function
function timer() {
  $('.timer').html('Time: ' + gameTime);
  var timeRemaining = setInterval(function(){
    if(gameTime > 0) {
      gameTime--;
    } else {
      clearInterval(timeRemaining);
      $('.game-gridsquare').off('click');
    }
    $('.timer').html('Time: ' + gameTime);
  }, 1000);
}

//Setup game grid, player grid and cpu (player 2) grid;
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

function setupCpuGrid(number) {

  for (var i=0; i<number; i++) {
    var shape = shapes[Math.floor(Math.random()*shapes.length)];
    cpuGrid.unshift(shape);
  }

  for (var i = 0; i < gameGridsize; i++) {
    $('#cpu-gridsquare-'+i).html(cpuGrid[i]);
  }
  return cpuGrid;
}

//Game play function upon square click
function playGame() {
  var gridsquareSelected = $(this);
  var playerSelected     = $('#player-gridsquare-5');
  var cpuSelected        = $('#cpu-gridsquare-5');

  if (gridsquareSelected.html() === playerSelected.html()) {

    updateScore('player', gridsquareSelected, true);
    changeGameGrid(gridsquareSelected);
    playerGrid.pop();
    setupPlayerGrid(1);

  } else if (gridsquareSelected.html() === cpuSelected.html()) {

    updateScore('cpu', gridsquareSelected, true);
    changeGameGrid(gridsquareSelected);
    cpuGrid.pop();
    setupCpuGrid(1);

  } else if (gridsquareSelected.html() !== cpuSelected.html()) {
    updateScore('player', gridsquareSelected, false);
  } else {
    updateScore('cpu', gridsquareSelected, false);
  }
  setTimeout(function(){ gridsquareSelected.css('background', 'none') }, 200);
}

//Update the score of the player upon correct and incorrect choices
function updateScore(player, gridsquareSelected, value) {
  if (player === 'player' && value === true) {
    playerScore++;
    $('#player-score')
      .html('Score: '+playerScore)
      .css('color', 'green');
    setTimeout(function(){ $('#player-score').css('color', 'black') }, 200);
    gridsquareSelected.css('background', 'green');
  } else if (player === 'cpu' && value === true) {
    cpuScore++;
    $('#cpu-score')
      .html('Score: '+cpuScore)
      .css('color', 'green');
    setTimeout(function(){ $('#cpu-score').css('color', 'black') }, 200);
    gridsquareSelected.css('background', 'green');
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
  var cpuSelectedShape = $('#cpu-gridsquare-5').html();
  var cpuSelectedShapeIndex = gameGrid.indexOf(cpuSelectedShape);
  return $('#'+cpuSelectedShapeIndex).trigger('click');
}

function cpuPlayGame() {
  var max = 15;
  var min = 10;
  var interval = (Math.floor(Math.random() * (max - min + 1)) + min)*100;

  var cpuMove = setInterval(function(){

    if(gameTime > 0) {
      cpuClickEvent();
    } else {
      clearInterval(cpuPlayGame);
      $('.game-gridsquare').off('click');
    }
  }, interval);
}