const Confession = require('../models/Confession');

async function paginateConfessions(req, res, shouldPopulate) {
  const totalConfessions = parseInt(await Confession.estimatedDocumentCount());
  const perPage = 5;
  const url = new URL(`https://${req.headers.host}${req.url}`);
  let page = parseInt(url.searchParams.get('page')) || 1;
  let skip = perPage * (page - 1);
  // If page exceeds confession count then it's reset to 1
  page = totalConfessions <= skip ? 1 : page;
  skip = perPage * (page - 1);
  let confessions = Confession.find()
    .sort('-createdAt')
    .skip(skip)
    .limit(perPage);

  // Admin will get staff info
  if (shouldPopulate) {
    confessions = confessions
      .populate('editedByStaff')
      .populate('markedByStaff');
  }

  confessions = await confessions;
  const prevPage = page > 1 ? page - 1 : null;
  const nextPage =
    skip + confessions.length < totalConfessions ? page + 1 : null;

  return {
    confessions,
    prevPage,
    nextPage,
  };
}

module.exports = paginateConfessions;
