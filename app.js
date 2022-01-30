const http = require('http');
const path = require('path');
const serveStatic = require('serve-static');
const onFinished = require('on-finished');
const flash = require('connect-flash');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const morgan = require('./lib/morgan');
const { ifRequestIsFile, matchURL, json } = require('./lib/utils');
const render = require('./lib/renderPug');
const cookieParser = require('./lib/cookieParser');
const ErrorResponse = require('./lib/errorResponse');
const { globalErrorHandler } = require('./helpers/errorHandlers');
const { identifyUser } = require('./helpers/authMiddlewares');
const templateHelpers = require('./helpers/templateHelpers');

const homeRouter = require('./routes/homeRouter');
const confessionRouter = require('./routes/confessionRouter');
const authRouter = require('./routes/authRouter');
const adminRouter = require('./routes/adminRouter');
const apiRouter = require('./routes/apiRouter');

const serve = serveStatic(path.join(__dirname, 'public'), { maxAge: '1y' });

const DB =
  process.env.NODE_ENV === 'development'
    ? process.env.DATABASE_DEV
    : process.env.DATABASE_PROD;

const sessionHandler = session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  maxAge: 30 * 24 * 60 * 60 * 1000,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 },
  store: MongoStore.create({ mongoUrl: DB }),
});

const flashHandler = flash();

async function middlewares(req, res) {
  const startTime = process.hrtime(); // To calculate response time
  sessionHandler(req, res, () => {
    // Development logging
    if (process.env.NODE_ENV === 'development')
      onFinished(res, () => morgan.dev(req, res, startTime)); // onFinished is invoked after response if finished

    // Helpers methods on response object
    res.locals = {};
    res.render = render(req, res);
    res.json = json;

    // Event emitters are used for error handling
    res.on('error', (err) => globalErrorHandler(err, req, res));

    if (ifRequestIsFile(req)) {
      const errorMessage = `${req.url} does not exist!`;
      return serve(req, res, () =>
        res.emit('error', new ErrorResponse(errorMessage, 404))
      );
    }

    // Middlewares
    req.cookies = cookieParser(req);

    // eslint-disable-next-line no-use-before-define
    flashHandler(req, res, () => server(req, res, startTime));
  });
}

async function server(req, res) {
  // Loading locals
  req.user = await identifyUser(req, res);
  res.locals.user = req.user;
  res.locals.currentURL = req.url;
  res.locals.flashes = req.flash();
  res.locals.h = templateHelpers;

  // Routes
  // Accepts: /, /new
  if (matchURL([/^\/$/, /^\/new(\/)?$/], req.url)) homeRouter(req, res);
  else if (
    // Accepts: /confessions, /confessions/:title-slug
    matchURL(
      [
        /^\/confessions(\/)?$/,
        /^\/confessions\?/,
        /^\/confessions\/[a-z0-9]+(?:-[a-z0-9]+)*(\/)?$/,
      ],
      req.url
    )
  )
    confessionRouter(req, res);
  else if (
    // Accepts: /login, /logout, /signup
    matchURL([/^\/login(\/)?$/, /^\/logout(\/)?$/, /^\/signup(\/)?$/], req.url)
  )
    authRouter(req, res);
  else if (
    // Accepts: /dashboard, /profile/:username, /edit/:id
    matchURL(
      [
        /^\/dashboard(\/)?$/,
        /^\/profile\/\w+(\/)?$/,
        /^\/edit\/[a-f\d]{24}(\/)?$/i,
      ],
      req.url
    )
  )
    adminRouter(req, res);
  else if (
    // Accepts: /api/confessions, /api/mark, /api/unmark, /api/delete
    matchURL(
      [
        /^\/api\/confessions(\/)?$/,
        /^\/api\/confessions\?/,
        /^\/api\/mark(\/)?$/,
        /^\/api\/unmark(\/)?$/,
        /^\/api\/delete(\/)?$/,
      ],
      req.url
    )
  )
    apiRouter(req, res);
  else {
    // Unhandled routes which are not assets
    res.emit('error', new ErrorResponse('Resource not found', 404));
  }
}

const app = http.createServer(middlewares);

module.exports = app;
