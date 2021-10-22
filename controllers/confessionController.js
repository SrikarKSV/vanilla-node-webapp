const parse = require('co-body');
const path = require('path');
const Confession = require('../models/Confession');

exports.getAllConfessions = async (req, res) => {
  const totalConfessions = parseInt(await Confession.estimatedDocumentCount());
  const perPage = 5;
  const url = new URL(`https://${req.headers.host}${req.url}`);
  let page = parseInt(url.searchParams.get('page')) || 1;
  let skip = perPage * (page - 1);
  // If page exceeds confession count then it's reset to 1
  page = totalConfessions <= skip ? 1 : page;
  skip = perPage * (page - 1);
  const confessions = await Confession.find()
    .sort('-createdAt')
    .skip(skip)
    .limit(perPage)
    .exec();
  const prevPage = page > 1 ? page - 1 : null;
  const nextPage =
    skip + confessions.length < totalConfessions ? page + 1 : null;

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
