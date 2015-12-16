angular
  .module('shapes')
  .controller('UsersController', UsersController);

UsersController.$inject = ['User', 'TokenService', 'CurrentUser'];
function UsersController(User, TokenService, CurrentUser) {

  var self = this;

  self.all  = [];
  self.user = {};

  self.register      = register;
  self.login         = login;
  self.logout        = logout;
  self.checkLoggedIn = checkLoggedIn;

  // Post register to the API, via User model routes
  function register() {
    User.register(self.user, handleLogin);
  }

  // Post login to the API, via User model routes
  function login() {
    User.login(self.user, handleLogin);
  }

  function logout() {
    TokenService.removeToken();
    self.all  = [];
    self.user = {};
    CurrentUser.clearUser();
  }

  function handleLogin(res) {
    var token = res.token ? res.token : null;
    if (token) {
      // self.getUsers();
      // $state.go('home');
    }
    // console.log(res);
    // self.user = TokenService.decodeToken();
    // CurrentUser.saveUser(self.user)
  }

  // Is user is logged in?
  function checkLoggedIn() {
    var loggedIn = !!TokenService.getToken();
    return loggedIn;
  }

  // Every time page is loaded, check if the user is logged in
  if (CurrentUser.getUser()) {
    // self.getUsers();
    // self.user = TokenService.decodeToken();
    // console.log(self.user);
  }

return self;
}