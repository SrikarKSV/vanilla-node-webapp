exports.login = (req, res) => {
  res.end('POST - Login');
};

exports.signup = (req, res) => {
  res.end('POST - Sign up');
};

exports.logout = (req, res) => {
  res.end('GET - Logout');
};

exports.getLogin = (req, res) => {
  res.end('GET - Login');
};

exports.getSignup = (req, res) => {
  res.end('GET - Sign up');
};
