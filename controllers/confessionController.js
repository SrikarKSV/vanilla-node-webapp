const path = require('path');
const bodyParser = require('../lib/bodyParser');
const ErrorResponse = require('../lib/errorResponse');
const { checkValidCsrfToken } = require('../lib/csrf');
const paginateConfessions = require('../helpers/paginateConfessions');
const Confession = require('../models/Confession');

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
  const { title, confession, color, csrfToken } = await bodyParser.form(
    req,
    res
  );

  if (!csrfToken || !checkValidCsrfToken(csrfToken, req)) {
    req.flash('error', 'Csrf token not valid ! Try again :)');
    return res.writeHead(303, { location: '/new' }).end();
  }

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
  if (req.user) {
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
