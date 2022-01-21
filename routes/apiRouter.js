const apiController = require('../controllers/apiController');
const { catchAsync } = require('../helpers/errorHandlers');
const { requireAuth } = require('../helpers/authMiddlewares');
const ErrorResponse = require('../lib/errorResponse');

function router(req, res) {
  const URL = req.url;
  const httpMethod = req.method;

  switch (httpMethod) {
    case 'GET': {
      if (URL.match(/^\/api\/confessions(\/)?$|^\/api\/confessions\?/))
        requireAuth(req, res, ['admin', 'mod'], () =>
          catchAsync(apiController.getAllConfessionsJSON, req, res)
        );
      break;
    }
    case 'PATCH': {
      if (URL.match(/^\/api\/mark(\/)?$/))
        requireAuth(req, res, ['admin', 'mod'], () =>
          catchAsync(apiController.markConfession, req, res)
        );
      break;
    }
    case 'DELETE': {
      if (URL.match(/^\/api\/delete(\/)?$/))
        requireAuth(req, res, ['admin'], () =>
          catchAsync(apiController.deleteConfession, req, res)
        );
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
