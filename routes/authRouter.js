const authController = require('../controllers/authController');
const ErrorResponse = require('../lib/errorResponse');

function router(req, res) {
  const URL = req.url;
  const httpMethod = req.method;

  switch (httpMethod) {
    case 'GET':
      if (URL.match(/^\/login(\/)?$/)) authController.getLogin(req, res);
      else if (URL.match(/^\/logout(\/)?$/)) authController.logout(req, res);
      else if (URL.match(/^\/signup(\/)?$/)) authController.getSignup(req, res);
      break;
    case 'POST':
      if (URL.match(/^\/login(\/)?$/)) authController.login(req, res);
      else if (URL.match(/^\/signup(\/)?$/)) authController.signup(req, res);
      break;
    default:
      const errorMessage = `${httpMethod} is not ALLOWED on ${req.headers.host}${URL}`;
      res.emit('error', new ErrorResponse(errorMessage, 405));
      break;
  }
}

module.exports = router;
