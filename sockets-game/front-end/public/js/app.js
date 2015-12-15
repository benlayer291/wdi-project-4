var socket      = io.connect();
var localPlayer = {};
var _players    = {};

$(function(){
  console.log('working');
  $('#join-game').on('submit', newPlayer);
})

function Player(id, name) {
  this.id   = id;
  this.name = name;
}

function newPlayer() {
  event.preventDefault();

  var name = $(this).find("input[name=name]").val();

  localPlayer = new Player(localPlayer.socketId, name);
  socket.emit('newPlayer', localPlayer);
}

socket.on('connect', function(){
  console.log('connected');
  localPlayer.socketId = socket.io.engine.id;
});

socket.on('players', function(players){
  console.log('All players: ', players);

})


socket.on('joined', function(player){
  console.log(player.id);
})
























// $(function(){
//   console.log('working');
//   Io.init();
//   App.init();
// })

// // Code related to setting up sockets.
// var Io = {

//   // Called when the page is loaded, connects the client-side socket to the server-side socket
//   init: function() {
//     Io.socket = io.connect();
//     Io.bindEvents();
//   },

//   // Runs when the init function is called upon the page load. Listens to the sockets on the backend
//   bindEvents: function() {
//     Io.socket.on('connected', Io.clientConnected);
//     Io.socket.on('players', Io.players);
//   },

//   clientConnected: function() {
//    App.localPlayer.socketId = socket.io.engine.id;
//   }

//   players: function(players) {
//     Object.keys(players).forEach(function(id){
//       var id = players[id].id;
//     })
//   }

// }

// //Code related to the running of the app
// var App = {

//   localPlayer: {},

//   init: function() {
//     App.bindEvents();
//   },

//   bindEvents: function() {
//     $('#join-game').on('click', App.newPlayer);
//   },

//   newPlayer: function() {
//     event.preventDefault();
//     App.localPlayer = new Player(App.localPlayer.socketId);
//     Io.socket.emit('newPlayer', localPlayer)
//   } 

// }

//  var Player = function(id){
//   this.id = id;
//  }