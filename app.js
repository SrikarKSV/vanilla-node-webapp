const http = require('http');
const path = require('path');
const serveStatic = require('serve-static');
const onFinished = require('on-finished');

const morgan = require('./lib/morgan');
const { ifRequestIsFile } = require('./lib/utils');
const render = require('./lib/renderPug');
const ErrorResponse = require('./lib/errorResponse');
const { globalErrorHandler } = require('./helpers/errorHandlers');
const homeRouter = require('./routes/homeRouter');
const confessionRouter = require('./routes/confessionRouter');

const serve = serveStatic(path.join(__dirname, 'public'));

const app = http.createServer(server);

function server(req, res) {
  // Middlewares
  const startTime = process.hrtime(); // To calculate response time
  res.render = render(req, res);
  res.on('error', (err) => globalErrorHandler(err, req, res));
  if (ifRequestIsFile(req)) {
    const errorMessage = `${req.headers.host}${req.url} does not exist!`;
    serve(req, res, () =>
      res.emit('error', new ErrorResponse(errorMessage, 404))
    );
  }

  // Development logging
  if (process.env.NODE_ENV === 'development')
    onFinished(res, () => morgan.dev(req, res, startTime)); // onFinished is invoked after response if finished

  // Routes
  if (req.url.match(/^\/$|^\/new(\/)?$/)) homeRouter(req, res);
  else if (
    req.url.match(
      /^\/confessions(\/)?$|^\/confessions\?|^\/confessions\/[a-z0-9]+(?:-[a-z0-9]+)*(\/)?$/
    )
  )
    confessionRouter(req, res);
  else if (!ifRequestIsFile(req)) {
    // Unhandled routes which are not assets
    res.emit('error', new ErrorResponse('Resource not found', 404));
  }
}

module.exports = app;
