angular
  .module('shapes', ['ngResource', 'angular-jwt', 'ui.router'])
  .constant('API','https://freeshapes.herokuapp.com/api')
  // .constant('API','http://localhost:3000/api')
  .config(MainRouter)
  .config(function($httpProvider){
    $httpProvider.interceptors.push('AuthInterceptor')
  })

  MainRouter.$inject = ['$stateProvider', '$urlRouterProvider'];

  function MainRouter($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: "/",
        templateUrl: "home.html"
      })
      .state('login', {
        url: "/login",
        templateUrl: "login.html"
      })
      .state('register', {
        url: "/register",
        templateUrl: "register.html"
      })
      .state('profile', {
        url: "/profile",
        templateUrl: "profile.html"
      })
      .state('game', {
        url: "/game",
        templateUrl: "game.html"
      })

    $urlRouterProvider.otherwise("/");
  }