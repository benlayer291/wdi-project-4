angular
  .module('shapes')
  .factory('User', User)

User.$inject = ['API', '$resource'];
function User(API, $resource) {

  return $resource(
    API + '/users/:id',
    {id: '@id'},
    { 'query':     { method: 'GET', isArray: false},
      'get':       { method: 'GET' },
      'save':      { method: 'POST' },
      'update':    { method: 'PUT'},
      'remove':    { method: 'DELETE' },
      'delete':    { method: 'DELETE' },
      'register': {
        url: API +'/register',
        method: "POST"
      },
      'login':      {
        url: API + '/login',
        method: "POST"
      }
    }
  );
}