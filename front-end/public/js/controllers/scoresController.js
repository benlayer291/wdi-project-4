angular
  .module('shapes')
  .controller('ScoresController', ScoresController);

ScoresController.$inject = ['Score', 'User', 'TokenService', 'CurrentUser']
function ScoresController(Score, User, TokenService, CurrentUser) {

  var self  = this;

  self.all           = [];
  self.player        = {}
  self.oneUserScores = [];

  self.getScores        = getScores;
  self.getOneUserScores = getOneUserScores;

  function getScores() {
    Score.query(function(data){
      self.all = data.scores;
    })
    // console.log(self.all);
  }

  function getOneUserScores(user_id) {
    Score.query(function(data){
      // console.log(data.scores[0].player);
      // console.log(self.player);
      for (var i=0; i< data.scores.length; i++) {
        if (data.scores[i].player === self.player._id) {
          self.oneUserScores.push(data.scores[i]);
        }
      }
    })
    setTimeout(function(){
      // console.log(self.oneUserScores);
    }, 1000);
  }

  if (CurrentUser.getUser()) {
    self.player = TokenService.decodeToken();
    // console.log(self.player);
  }

  self.getOneUserScores();

return self
}
