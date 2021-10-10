const parse = require('co-body');
const path = require('path');
const Confession = require('../models/Confession');

exports.createConfession = async (req, res) => {
  const { title, confession } = await parse.form(req);
  const createdConfession = await Confession.create({ title, confession });
  res.writeHead(302, {
    location: `http://localhost:3000/confessions/${createdConfession.slug}`,
  });
  res.end();
};

exports.confession = async (req, res) => {
  const slug = path.parse(req.url).base;
  const { title, confession } = await Confession.findOne({ slug });
  res.render('confession', { title, confession });
};
