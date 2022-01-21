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

exports.markConfession = (req, res) => {
  res.end('PATCH - Mark');
};

exports.deleteConfession = async (req, res) => {
  const { id } = await parse.json(req);
  await Confession.findByIdAndDelete(id);
  res.json({ status: 200, msg: 'Confessions delete successfully' });
};
