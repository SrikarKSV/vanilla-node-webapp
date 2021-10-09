exports.home = (req, res) => {
  res.render('index', {
    name: 'Srikar',
  });
};

exports.newConfession = (req, res) => {
  res.render('new-confession');
};
