const http = require('http');
const path = require('path');
const serveStatic = require('serve-static');
const onFinished = require('on-finished');
const flash = require('connect-flash');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const morgan = require('./lib/morgan');
const { ifRequestIsFile } = require('./lib/utils');
const render = require('./lib/renderPug');
const cookieParser = require('./lib/cookieParser');
const ErrorResponse = require('./lib/errorResponse');
const { globalErrorHandler } = require('./helpers/errorHandlers');
const homeRouter = require('./routes/homeRouter');
const confessionRouter = require('./routes/confessionRouter');

const serve = serveStatic(path.join(__dirname, 'public'));

const DB =
  process.env.NODE_ENV === 'development'
    ? process.env.DATABASE_DEV
    : process.env.DATABASE_PROD.replace(
        '<PASSWORD>',
        process.env.DATABASE_PASSWORD
      );

const sessionHandler = session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: DB }),
});

const flashHandler = flash();
// TODO: Handle req.flashes and local.flashes
const app = http.createServer((req, res) => {
  sessionHandler(req, res, () => {
    req.cookies = cookieParser(req);
    flashHandler(req, res, () => server(req, res));
  });
});

function server(req, res) {
  // Middlewares
  const startTime = process.hrtime(); // To calculate response time
  req.flashes = req.flash();
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
