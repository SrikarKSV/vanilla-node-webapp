const mongoose = require('mongoose');
const slugify = require('slugify');

const confessionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required for a confession!'],
    trim: true,
    maxlength: 100,
  },
  confession: {
    type: String,
    required: [true, 'Confession is required!'],
    maxlength: 14000,
  },
  slug: String,
  color: {
    type: String,
    required: [true, 'Color is required!'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  viewCount: {
    type: Number,
    default: 0,
  },
  editedByStaff: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    default: null,
  },
  markedByStaff: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    default: null,
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

confessionSchema.statics.getPostsMarkedAsSpam = function () {
  return this.aggregate([
    {
      $addFields: {
        isMarkedAsSpam: {
          $toBool: '$markedByStaff',
        },
      },
    },
    {
      $match: {
        isMarkedAsSpam: true,
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'markedByStaff',
        foreignField: '_id',
        as: 'markedByStaff',
      },
    },
    {
      $unwind: '$markedByStaff',
    },
  ]);
};

const confessionModel = mongoose.model('Confession', confessionSchema);

module.exports = confessionModel;
