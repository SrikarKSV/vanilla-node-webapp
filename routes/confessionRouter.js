const confessionController = require('../controllers/confessionController');
const { catchAsync } = require('../helpers/errorHandlers');
const ErrorResponse = require('../lib/errorResponse');

function router(req, res) {
  const URL = req.url;
  const httpMethod = req.method;

  switch (httpMethod) {
    case 'GET': {
      if (URL.match(/^\/confessions(\/)?$|^\/confessions\?/))
        catchAsync(confessionController.getAllConfessions, req, res);
      else if (URL.match(/^\/confessions\/[a-z0-9]+(?:-[a-z0-9]+)*(\/)?$/))
        catchAsync(confessionController.getConfession, req, res);
      break;
    }
    case 'POST': {
      if (URL.match(/^\/confessions(\/)?$/))
        catchAsync(confessionController.createConfession, req, res);
      break;
    }
    default: {
      const errorMessage = `${httpMethod} is not ALLOWED on ${req.headers.host}${URL}`;
      res.emit('error', new ErrorResponse(errorMessage, 405));
      break;
    }
  }
}

module.exports = router;
