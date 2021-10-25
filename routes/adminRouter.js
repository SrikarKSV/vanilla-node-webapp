const adminController = require('../controllers/adminController');
const { catchAsync } = require('../helpers/errorHandlers');
const { requireAuth } = require('../helpers/authMiddlewares');
const ErrorResponse = require('../lib/errorResponse');

function router(req, res) {
  const URL = req.url;
  const httpMethod = req.method;

  switch (httpMethod) {
    case 'GET':
      if (URL.match(/^\/admin(\/)?$/))
        requireAuth(req, res, ['admin', 'mod'], () =>
          catchAsync(adminController.admin, req, res)
        );
      else if (URL.match(/^\/profile\/\w+$/))
        requireAuth(req, res, ['admin', 'mod'], () =>
          catchAsync(adminController.profile, req, res)
        );
      else if (URL.match(/^\/edit\/[a-f\d]{24}$/i))
        requireAuth(req, res, ['admin', 'mod'], () =>
          catchAsync(adminController.getEdit, req, res)
        );
      break;
    case 'POST':
      if (URL.match(/^\/edit\/[a-f\d]{24}$/i))
        requireAuth(req, res, ['admin', 'mod'], () =>
          catchAsync(adminController.edit, req, res)
        );
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
