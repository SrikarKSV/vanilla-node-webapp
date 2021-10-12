const mongoose = require('mongoose');
const slugify = require('slugify');

const confessionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: 'Title is required for a confession!',
    trim: true,
    maxlength: 100,
  },
  confession: {
    type: String,
    required: [true, 'Confession is required!'],
  },
  slug: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  viewCount: {
    type: Number,
    default: 0,
  },
  editedByAdmin: {
    type: Boolean,
    default: false,
  },
});

confessionSchema.pre('save', async function (next) {
  if (!this.isModified('title')) {
    return next(); // skip if title not edited
  }
  this.slug = slugify(this.title, {
    lower: true,
    strict: true,
  });
  // find other slugs with same title like i-did, i-did-2
  const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
  const confessionSlugs = await this.constructor.find({ slug: slugRegEx });
  if (confessionSlugs.length)
    this.slug = `${this.slug}-${confessionSlugs.length + 1}`;
  next();
});

confessionSchema.statics.getTop5Confessions = function () {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  return this.aggregate([
    {
      $match: {
        createdAt: { $gte: yesterday, $lte: today },
      },
    },
    {
      $sort: {
        viewCount: -1,
      },
    },
    {
      $limit: 5,
    },
  ]);
};

const confessionModel = mongoose.model('Confession', confessionSchema);

module.exports = confessionModel;
