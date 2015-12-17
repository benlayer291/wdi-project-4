angular
  .module('shapes')
  .factory('Game', Game)

  Game.$inject = ['API', '$resource'];
  function Game(API, $resource) {

    return $resource(
      API + '/games/:id',
      {id: '@id'},
      { 'query':     { method: 'GET', isArray: false},
        'get':       { method: 'GET' },
        'save':      { method: 'POST' },
        'update':    { method: 'PUT'},
        'remove':    { method: 'DELETE' },
        'delete':    { method: 'DELETE' }
      }
    );
  }