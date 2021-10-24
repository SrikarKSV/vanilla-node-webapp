const Confession = require('../models/Confession');

// TODO: Check if admin or mod and provide relevent actions
exports.admin = async (req, res) => {
  const postsMarked = await Confession.getPostsMarkedAsSpam();

  res.render('admin', {
    postsMarked,
  });
};
