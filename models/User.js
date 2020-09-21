const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Tweet = require('./Tweet');
const Like = require('./Like');

const UserSchema = new Schema(
  {
    fullname: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    birth_date: {
      type: Date,
      required: true,
    },
    avatar: {
      type: Buffer,
      default: null,
    },
    cover: {
      type: Buffer,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.virtual('tweets', {
  ref: 'Tweet',
  localField: '_id',
  foreignField: 'user',
});

UserSchema.virtual('likes', {
  ref: 'Like',
  localField: '_id',
  foreignField: 'user',
});

UserSchema.pre('remove', async function (next) {
  const user = this;
  console.log('pre user remove :>> ', user);
  await Tweet.deleteMany({ user: user._id });
  await Like.deleteMany({ user: user._id });
  next();
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
