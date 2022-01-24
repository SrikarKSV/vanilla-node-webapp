const parse = require('co-body');
const path = require('path');
const Confession = require('../models/Confession');
const paginateConfessions = require('../helpers/paginateConfessions');
const ErrorResponse = require('../lib/errorResponse');

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
  const { title, confession, color } = await parse.form(req);
  const createdConfession = await Confession.create({
    title,
    confession,
    color,
  });
  res.writeHead(303, {
    location: `/confessions/${createdConfession.slug}`,
  });
  res.end();
};

exports.getConfession = async (req, res) => {
  const slug = path.parse(req.url).base;
  let singleConfession = Confession.findOne({ slug });

  // If staff is viewing then load last edited staff info
  if (res.locals.user) {
    singleConfession.populate('editedByStaff');
  }
  singleConfession = await singleConfession;

  if (!singleConfession) {
    const errorMessage =
      'Confession not found or is removed due to violitions of regulations';
    return res.emit('error', new ErrorResponse(errorMessage, 404));
  }
  singleConfession.viewCount += 1;
  singleConfession.save();
  const { title, confession, color, viewCount, createdAt, editedByStaff } =
    singleConfession;

  res.render('confession', {
    title,
    confession,
    color,
    viewCount,
    createdAt,
    editedByStaff,
  });
};
