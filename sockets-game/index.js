// Require node modules
var express        = require('express');
var mongoose       = require('mongoose');
var methodOverride = require('method-override');
var morgan         = require('morgan');
var bodyParser     = require('body-parser');
var cookieParser   = require('cookie-parser');
var cors           = require('cors');
var passport       = require('passport');
var jwt            = require('jsonwebtoken');
var expressJWT     = require('express-jwt');
var port           = process.env.PORT || 3000;

// Create a new instance of Express
var app     = express();

// Setup
var config = require('./config/config');
var secret = config.secret;

mongoose.connect(config.database);

require('./config/passport')(passport);

// Middleware
app.use(methodOverride(function(req, res){
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    var method = req.body._method
    delete req.body._method
    return method
  }
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(cors());
app.use(passport.initialize());

app.use('/api', expressJWT({ secret: secret })
  .unless({
    path: [
      { url: '/api/login', methods: ['POST'] },
      { url: '/api/register', methods: ['POST'] }
    ]
  }));
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({message: 'You are not authorized to access this page'});
  }
  next();
});

//Routes
var routes = require('./config/routes');
app.use("/api", routes);

// Serve front-end html, js, css from the 'public' directory
app.use(express.static(__dirname + '/front-end/public'));

// Create a node.js based http server and state the port to listen to
var http    = require('http').Server(app);

http.listen(port, function(){
  console.log('***listening on localhost:3000***');
});

// Create a socket.io server and relate it to the node.js http server
var io    = require('socket.io')(http);
var Game  = require('./models/game');
var User  = require('./models/user');
var Score = require('./models/score');
var games    = {};
var player   = {};
var gameRoom;

//Listen for socket.io connections, linked to client.js file on frontend
io.on('connection', function(socket){

  socket.on("newGame", function(socketId, creatingPlayer){

    // If new game, create new game in database? The object below is like model in database
    var newGame   = new Game({socket_id: socketId});

    User.findOne({_id: creatingPlayer._id}, function(err, user){
      var newScore  = new Score();
      var newPlayer = user;

      newScore.player = newPlayer;
      newScore.save();


      newGame.players.push(newPlayer);
      newGame.scores.push(newScore);
      newGame.save();

      console.log("THE NEW GAME", newGame);

      io.emit("addToListOfGames", newGame);
    });
   
    gameRoom = "game_"+socketId;
    socket.join(gameRoom);
  });

  socket.on("joinedGame", function(gameId, socketId, joiningPlayer) {
    gameRoom = "game_"+gameId;

    Game.findOne({socket_id: gameId}, function(err, game){
      if (err) throw err;

      User.findOne({_id: joiningPlayer._id}, function(err, user){
        var newScore  = new Score();
        var newPlayer = user;

        newScore.player = newPlayer;
        newScore.save();

        game.players.push(newPlayer);
        game.scores.push(newScore);
        game.save();

        socket.join(gameRoom);

        //CREATE GRID
        // var shapes = ['&#9623;', '&#9679;', '&#9658;', '&#9648;', '&#9670;', '&#9646;', '&#9625;', '&#9630', '&#10030'];
        var shapes = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
        game.grid = [];
        for (var i = 0; i < 9; i++) {
          var shape = shapes[Math.floor(Math.random()*shapes.length)];
          var shapeIndex = shapes.indexOf(shape);
          game.grid.push(shape);
          shapes.splice(shapeIndex, 1);
        }

        io.to(gameRoom).emit('start', game);
      });
    });
  });

  socket.on("playingGame", function(gameId, socketId, player, playerShape, squareClicked){

    Game.findOne({socket_id: gameId}, function(err, game){
      if (err) throw err;

      //correct choice
      if (playerShape === squareClicked) {
        console.log(player.local.firstname, ' got the grid choice correct!')
        var squareClickedIndex = game.grid.indexOf(squareClicked);
        var squareToSwapIndex  = Math.floor(Math.random()*game.grid.length);

        // change the grid
        game.grid[squareClickedIndex] = game.grid[squareToSwapIndex];
        game.grid[squareToSwapIndex]  = squareClicked;

        // change the score
        for (var i = 0; i < game.players.length; i++) {
          console.log("CHECKING PLAYER:", game.players[i])
          if (game.players[i] == player._id) {
            Score.findOne({_id: game.scores[i]}, function(err, score){
              if (err) throw err;
              score.value++;
              score.save();

              //send to front-end
              return io.to(gameRoom).emit('correctChoice', game, socketId, score);
            });
          };
        };
      }; 
    });
  });

});