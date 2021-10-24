const http = require('http');
const path = require('path');
const serveStatic = require('serve-static');
const onFinished = require('on-finished');
const flash = require('connect-flash');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const morgan = require('./lib/morgan');
const { ifRequestIsFile, matchURL } = require('./lib/utils');
const render = require('./lib/renderPug');
const cookieParser = require('./lib/cookieParser');
const ErrorResponse = require('./lib/errorResponse');
const { globalErrorHandler } = require('./helpers/errorHandlers');
const { checkUser } = require('./helpers/authMiddlewares');

const homeRouter = require('./routes/homeRouter');
const confessionRouter = require('./routes/confessionRouter');
const authRouter = require('./routes/authRouter');
const adminRouter = require('./routes/adminRouter');

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
const app = http.createServer(middlewares);

function middlewares(req, res) {
  const startTime = process.hrtime(); // To calculate response time
  sessionHandler(req, res, () => {
    req.cookies = cookieParser(req);
    res.locals = {};
    res.render = render(req, res);
    res.on('error', (err) => globalErrorHandler(err, req, res));

    if (ifRequestIsFile(req)) {
      const errorMessage = `${req.headers.host}${req.url} does not exist!`;
      serve(req, res, () =>
        res.emit('error', new ErrorResponse(errorMessage, 404))
      );
    }
    flashHandler(req, res, () => server(req, res, startTime));
  });
}

async function server(req, res, startTime) {
  res.locals.flashes = req.flash();

  // Development logging
  if (process.env.NODE_ENV === 'development')
    onFinished(res, () => morgan.dev(req, res, startTime)); // onFinished is invoked after response if finished

  if (!ifRequestIsFile(req)) res.locals.user = await checkUser(req, res);

  // Routes
  if (matchURL([/^\/$/, /^\/new(\/)?$/], req.url)) homeRouter(req, res);
  else if (
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
    matchURL([/^\/login(\/)?$/, /^\/logout(\/)?$/, /^\/signup(\/)?$/], req.url)
  )
    authRouter(req, res);
  else if (
    matchURL(
      [
        /^\/admin(\/)?$/,
        /^\/profile\/\w+$/,
        /^\/edit\/[a-f\d]{24}$/i,
        /^\/mark(\/)?$/,
        /^\/delete(\/)?$/,
      ],
      req.url
    )
  )
    adminRouter(req, res);
  else if (!ifRequestIsFile(req)) {
    // Unhandled routes which are not assets
    res.emit('error', new ErrorResponse('Resource not found', 404));
  }
}

module.exports = app;
