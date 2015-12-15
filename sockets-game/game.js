// module.exports = {

//   players: {},

//   initGame: function(io, socket) {
//     console.log('a user connected');
//     socket.emit('connected'); //Send to notify client-side
//     // e.g. socket.on.(function called on client-side, function to run on server-side)
//     socket.on('newPlayer', newPlayer(player))
//   }

// }
// function newPlayer(player) {
//   players[player.id] = player;
//   console.log(players);
//   socket.broadcast.emit('joined', player);
// }