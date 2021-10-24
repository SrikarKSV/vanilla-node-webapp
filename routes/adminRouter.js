const adminController = require('../controllers/adminController');
const { requireAuth } = require('../helpers/authMiddlewares');
const ErrorResponse = require('../lib/errorResponse');

function router(req, res) {
  const URL = req.url;
  const httpMethod = req.method;

  switch (httpMethod) {
    case 'GET':
      if (URL.match(/^\/admin(\/)?$/))
        requireAuth(res, ['admin', 'mod'], () =>
          adminController.admin(req, res)
        );
      else if (URL.match(/^\/profile\/\w+$/))
        requireAuth(res, ['admin', 'mod'], () =>
          adminController.profile(req, res)
        );
      else if (URL.match(/^\/edit\/[a-z0-9]+(?:-[a-z0-9]+)*(\/)?$/))
        res.end('GET - Edit');
      break;
    case 'PATCH':
      if (URL.match(/^\/edit\/[a-z0-9]+(?:-[a-z0-9]+)*(\/)?$/))
        res.end('POST - Edit');
      else if (URL.match(/^\/mark(\/)?$/)) res.end('PATCH - Mark');
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
