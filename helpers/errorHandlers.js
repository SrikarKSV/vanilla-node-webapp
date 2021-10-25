exports.catchAsync = (fn, req, res) => {
  return fn(req, res).catch((err) => {
    res.emit('error', err);
  });
};

function flashValidationErrors(err, req, res) {
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
  res.render('error', errorDetails);
}

function sendErrorProd(err, req, res) {
  res.statusCode = err.statusCode;
  res.render('error', {
    message: err.message,
    status: err.statusCode,
    title: 'Something went wrong!',
  });
}

exports.globalErrorHandler = (err, req, res) => {
  err.statusCode = err.statusCode || 500;
  const isFlashValidationError = flashValidationErrors(err, req, res);
  if (isFlashValidationError) return;

  if (process.env.NODE_ENV === 'development') sendErrorDev(err, req, res);
  else if (process.env.NODE_ENV === 'production') sendErrorProd(err, req, res);
};
