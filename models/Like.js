const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LikeSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    tweet: {
      type: Schema.Types.ObjectId,
      ref: 'Tweet',
    },
  },
  {
    timestamps: true,
  }
);

const Like = mongoose.model('Like', LikeSchema);

module.exports = Like;
