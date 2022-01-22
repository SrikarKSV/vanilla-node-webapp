const Confession = require('../models/Confession');

exports.home = async (req, res) => {
  const top5Confessions = await Confession.getTop5Confessions();
  res.render('index', {
    top5Confessions,
  });
};

exports.newConfession = (req, res) => {
  res.render('new-confession', { title: 'Write a confession' });
};
