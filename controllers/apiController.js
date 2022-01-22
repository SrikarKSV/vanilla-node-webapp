const parse = require('co-body');
const paginateConfessions = require('../helpers/paginateConfessions');
const Confession = require('../models/Confession');

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
  if (!confession.markedByStaff) {
    confession.markedByStaff = res.locals.user._id;
    confession.save();
    res.json({ status: 200, msg: 'Confession marked successfully!' });
  } else {
    res.statusCode = 422;
    res.json({
      status: 422,
      msg: 'Confession already marked!',
      markedByStaff: confession.markedByStaff.username,
    });
  }
};

exports.unMarkConfession = async (req, res) => {
  const { id } = await parse.json(req);
  const confession = await Confession.findById(id).populate('markedByStaff');
  if (!confession.markedByStaff) {
    res.statusCode = 422;
    res.json({ status: 422, msg: 'Confession is not marked!' });
  } else {
    confession.markedByStaff = null;
    confession.save();
    res.json({ status: 200, msg: 'Confession is was unmarked!' });
  }
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
