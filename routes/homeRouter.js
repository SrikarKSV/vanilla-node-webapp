const homeController = require('../controllers/homeController');
const ErrorResponse = require('../lib/errorResponse');

function router(req, res) {
  const URL = req.url;
  const httpMethod = req.method;

  switch (httpMethod) {
    case 'GET':
      if (URL === '/') homeController.home(req, res);
      else if (URL.match(/\/new(\/)?/)) homeController.newConfession(req, res);
      // TODO: Add edit route if admin functionality is added
      break;
    default:
      const errorMessage = `${httpMethod} is not ALLOWED on ${req.headers.host}${URL}`;
      res.emit('error', new ErrorResponse(errorMessage, 405));
      break;
  }
}

module.exports = router;
