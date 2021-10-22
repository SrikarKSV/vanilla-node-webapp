const ErrorResponse = require('../lib/errorResponse');

function router(req, res) {
  const URL = req.url;
  const httpMethod = req.method;

  switch (httpMethod) {
    case 'GET':
      if (URL.match(/^\/admin(\/)?$/)) res.end('GET - Admin');
      else if (URL.match(/^\/profile\/\w+$/)) res.end('GET - Profile');
      else if (URL.match(/^\/edit\/[a-z0-9]+(?:-[a-z0-9]+)*(\/)?$/))
        res.end('GET - Edit');
      break;
    case 'POST':
      if (URL.match(/^\/edit\/[a-z0-9]+(?:-[a-z0-9]+)*(\/)?$/))
        res.end('POST - Edit');
      break;
    case 'PATCH':
      if (URL.match(/^\/mark(\/)?$/)) res.end('PATCH - Mark');
      break;
    case 'DELETE':
      if (URL.match(/^\/delete(\/)?$/)) res.end('DELETE - Delete');
    default:
      const errorMessage = `${httpMethod} is not ALLOWED on ${req.headers.host}${URL}`;
      res.emit('error', new ErrorResponse(errorMessage, 405));
      break;
  }
}

module.exports = router;
