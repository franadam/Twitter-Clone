const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TweetSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    text: {
      type: String,
      required: true,
    },
    tweet: {
      type: Schema.Types.ObjectId,
      ref: 'Tweet',
      default: null,
    },
    media: {
      type: Buffer,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

TweetSchema.virtual('likes', {
  ref: 'Like',
  localField: '_id',
  foreignField: 'tweet',
});

const Tweet = mongoose.model('Tweet', TweetSchema);

module.exports = Tweet;
