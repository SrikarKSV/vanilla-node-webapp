function generateCsrf(req) {
  // Generate csrf token
  const csrfToken = Math.random().toString(36).slice(2);
  req.session.csrf = csrfToken;
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
