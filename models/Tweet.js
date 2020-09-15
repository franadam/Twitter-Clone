const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TweetSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'users',
    },
    text: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const Tweet = mongoose.model('Tweet', TweetSchema);

module.exports = Tweet;
