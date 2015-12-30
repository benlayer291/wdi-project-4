angular
  .module('shapes')
  .service('TokenService', TokenService);

TokenService.$inject = ['$window', 'jwtHelper'];
function TokenService($window, jwtHelper) {

  var self = this;

  self.getToken    = getToken;
  self.setToken    = setToken;
  self.removeToken = removeToken;
  self.decodeToken = decodeToken;

  function getToken() {
    return $window.localStorage.getItem('auth-token');
  }

  function setToken(token) {
    return $window.localStorage.setItem('auth-token', token);
  }

  function removeToken() {
    return $window.localStorage.removeItem('auth-token');
  }

  function decodeToken() {
    var token = self.getToken();
    return token ? jwtHelper.decodeToken(token) : {};
  }
}