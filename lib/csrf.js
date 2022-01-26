const { randomBytes } = require('crypto');

function generateCsrf(req) {
  // Generate csrf token
  const csrfToken = randomBytes(20).toString('hex');
  req.session = { ...req.session, csrf: csrfToken };
  return csrfToken;
}

function checkValidCsrfToken(csrfToken, req) {
  const isValid = csrfToken === req.session?.csrf;
  if (isValid) {
    delete req.session.csrf;
  }
  return isValid;
}

module.exports = { generateCsrf, checkValidCsrfToken };
