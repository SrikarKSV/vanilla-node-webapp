const parse = require('co-body');
const path = require('path');
const Confession = require('../models/Confession');
const paginateConfessions = require('../helpers/paginateConfessions');

exports.getAllConfessions = async (req, res) => {
  const { confessions, prevPage, nextPage } = await paginateConfessions(
    req,
    res,
    false
  );

  res.render('all-confessions', {
    confessions,
    prevPage,
    nextPage,
    title: 'All confessions',
  });
};

exports.createConfession = async (req, res) => {
  const { title, confession } = await parse.form(req);
  const createdConfession = await Confession.create({ title, confession });
  res.writeHead(303, {
    location: `/confessions/${createdConfession.slug}`,
  });
  res.end();
};

exports.getConfession = async (req, res) => {
  const slug = path.parse(req.url).base;
  const singleConfession = await Confession.findOne({ slug });
  singleConfession.viewCount += 1;
  singleConfession.save();
  const { title, confession, viewCount, createdAt } = singleConfession;
  res.render('confession', { title, confession, viewCount, createdAt });
};
