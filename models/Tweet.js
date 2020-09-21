const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Like = require('./Like');

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
  },
  {
    timestamps: true,
  }
);

//TweetSchema.virtual('likes', {
//  ref: 'Like',
//  localField: '_id',
//  foreignField: 'tweet',
//});

TweetSchema.pre('deleteOne', async function (next) {
  const tweet = this;
  const like = await Like.findOne({ tweet: tweet._id });
  console.log('pre tweet remove id :>> ', tweet);
  console.log('pre tweet remove like :>> ', like);
  await Like.deleteMany({ tweet: tweet._id });
  next();
});

const Tweet = mongoose.model('Tweet', TweetSchema);

module.exports = Tweet;
