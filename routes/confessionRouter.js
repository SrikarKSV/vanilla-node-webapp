const confessionController = require('../controllers/confessionController');
const ErrorResponse = require('../lib/errorResponse');

function router(req, res) {
  const URL = req.url;
  const httpMethod = req.method;

  switch (httpMethod) {
    case 'GET':
      if (URL.match(/^\/confessions(\/)?$|^\/confessions\?/)) {
        // TODO: Show all confessions
      } else if (URL.match(/^\/confessions\/[a-z0-9]+(?:-[a-z0-9]+)*(\/)?$/)) {
        // TODO: Show inidividual confession
        confessionController.getConfession(req, res);
      }
      break;
    case 'POST':
      if (URL.match(/^\/confessions(\/)?$/)) {
        // TODO: Create the confession
        confessionController.createConfession(req, res);
      }
      break;
    default:
      const errorMessage = `${httpMethod} is not ALLOWED on ${req.headers.host}${URL}`;
      res.emit('error', new ErrorResponse(errorMessage, 405));
      break;
  }
}

module.exports = router;
