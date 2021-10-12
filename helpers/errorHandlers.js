exports.catchAsync = (fn, req, res) => {
  return fn(req, res).catch((err) => {
    res.emit('error', err);
  });
};

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
  if (process.env.NODE_ENV === 'development') sendErrorDev(err, req, res);
  else if (process.env.NODE_ENV === 'production') sendErrorProd(err, req, res);
};
