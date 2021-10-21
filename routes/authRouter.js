const ErrorResponse = require('../lib/errorResponse');

function router(req, res) {
  const URL = req.url;
  const httpMethod = req.method;

  switch (httpMethod) {
    case 'GET':
      if (URL.match(/^\/login(\/)?$/)) {
        res.end('GET - Login');
      } else if (URL.match(/^\/logout(\/)?$/)) {
        res.end('GET - Logout');
      } else if (URL.match(/^\/signup(\/)?$/)) {
        res.end('GET - Sign up');
      }
      break;
    case 'POST':
      if (URL.match(/^\/login(\/)?$/)) {
        res.end('POST - Login');
      } else if (URL.match(/^\/signup(\/)?$/)) {
        res.end('POST - Sign up');
      }
      break;
    default:
      const errorMessage = `${httpMethod} is not ALLOWED on ${req.headers.host}${URL}`;
      res.emit('error', new ErrorResponse(errorMessage, 405));
      break;
  }
}

module.exports = router;
