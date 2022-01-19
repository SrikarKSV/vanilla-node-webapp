/* eslint-disable no-param-reassign */
exports.catchAsync = (fn, req, res) =>
  fn(req, res).catch((err) => {
    res.emit('error', err);
  });

function flashValidationErrors(err, req, res) {
  // Handling unique error for username
  if (err.code === 11000) {
    err.errors = {
      ...err.errors,
      username: { message: 'Username already taken!' },
    };
  }
  if (!err.errors) return false;
  // validation errors look like
  const errorKeys = Object.keys(err.errors);
  errorKeys.forEach((key) => req.flash('error', err.errors[key].message));
  res
    .writeHead(303, {
      location: req.headers.referer,
    })
    .end();
  return true;
}

function sendErrorDev(err, req, res) {
  err.stack = err.stack || '';
  const errorDetails = {
    message: err.message,
    status: err.statusCode,
    title: 'Something went wrong!',
    stackHighlighted: err.stack.replace(
      /[a-z_-\d]+.js:\d+:\d+/gi, // This is to highlight the filenames from which the error orginated
      '<mark>$&</mark>'
    ),
  };
  res.statusCode = err.statusCode;

  // Return json for fetch requests
  if (req.headers.accept === 'application/json')
    return res.json({
      error: errorDetails.message,
      status: errorDetails.status,
    });

  res.render('error', errorDetails);
}

function sendErrorProd(err, req, res) {
  res.statusCode = err.statusCode;

  const errorDetails = {
    message: err.message,
    status: err.statusCode,
    title: 'Something went wrong!',
  };

  // Return json for fetch requests
  if (req.headers.accept === 'application/json')
    return res.json({
      error: errorDetails.message,
      status: errorDetails.status,
    });

  res.render('error', errorDetails);
}

exports.globalErrorHandler = (err, req, res) => {
  err.statusCode = err.statusCode || 500;
  const isFlashValidationError = flashValidationErrors(err, req, res);
  if (isFlashValidationError) return;

  if (process.env.NODE_ENV === 'development') sendErrorDev(err, req, res);
  else if (process.env.NODE_ENV === 'production') sendErrorProd(err, req, res);
};
