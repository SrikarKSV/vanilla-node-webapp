const parse = require('co-body');
const paginateConfessions = require('../helpers/paginateConfessions');
const Confession = require('../models/Confession');
const User = require('../models/User');

function sanitizeAllConfessions(allConfessions) {
  const { confessions, nextPage, prevPage } = allConfessions;
  const sanitizedConfessions = confessions.map((confession) => ({
    title: confession.title,
    id: confession._id,
    createdAt: confession.createdAt,
    slug: confession.slug,
    markedByStaff: confession.markedByStaff?.username,
    viewCount: confession.viewCount,
  }));

  return { confessions: sanitizedConfessions, nextPage, prevPage };
}

exports.getAllConfessionsJSON = async (req, res) => {
  const allConfessions = await paginateConfessions(req, res, true);
  const sanitizedConfessions = sanitizeAllConfessions(allConfessions);
  res.json(sanitizedConfessions);
};

exports.markConfession = async (req, res) => {
  const { id } = await parse.json(req);
  const confession = await Confession.findById(id).populate('markedByStaff');

  // If already marked
  if (confession.markedByStaff) {
    res.statusCode = 422;
    return res.json({
      status: 422,
      msg: 'Confession already marked!',
      markedByStaff: confession.markedByStaff.username,
    });
  }

  confession.markedByStaff = res.locals.user._id;
  confession.save();

  await User.findByIdAndUpdate(res.locals.user._id, {
    $addToSet: { postsMarked: confession._id },
  });

  res.json({
    status: 200,
    msg: 'Confession marked successfully!',
    markedByStaff: res.locals.user.username,
  });
};

exports.unMarkConfession = async (req, res) => {
  const { id } = await parse.json(req);
  const confession = await Confession.findById(id).populate('markedByStaff');

  // If somebody already unmarked it
  if (!confession.markedByStaff) {
    res.statusCode = 422;
    return res.json({ status: 422, msg: 'Confession was not marked!' });
  }

  confession.markedByStaff = null;
  confession.save();
  res.json({ status: 200, msg: 'Confession was unmarked!' });
};

exports.deleteConfession = async (req, res) => {
  const { id } = await parse.json(req);
  const deletedConfession = await Confession.findByIdAndDelete(id);
  if (!deletedConfession) {
    res.statusCode = 410;
    return res.json({
      status: 410,
      msg: 'Confession already deleted!',
    });
  }
  res.json({ status: 200, msg: 'Confession deleted successfully!' });
};
