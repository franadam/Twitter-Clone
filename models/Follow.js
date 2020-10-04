const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FollowSchema = new Schema(
  {
    follower: {
      type: Schema.Types.ObjectId,
      ref: 'users',
    },
    followed: {
      type: Schema.Types.ObjectId,
      ref: 'users',
    },
  },
  {
    timestamps: true,
  }
);

const Follow = mongoose.model('Follow', FollowSchema);

module.exports = Follow;
