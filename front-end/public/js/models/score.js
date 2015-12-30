angular
  .module('shapes')
  .factory('Score', Score)

  Score.$inject = ['API', '$resource'];
  function Score(API, $resource) {

    return $resource(
      API + '/scores/:id',
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