const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const sharp = require('sharp');
const passport = require('passport');

const User = require('../../models/User');
const Tweet = require('../../models/Tweet');
const Like = require('../../models/Like');
const validateTweetInput = require('../../validation/tweets');
const uploadImage = require('../../services/loader');

router.get('/', async (req, res) => {
  try {
    const tweets = await Tweet.aggregate([
      {
        $lookup: {
          from: 'likes',
          localField: '_id',
          foreignField: 'tweet',
          as: 'likes',
        },
      },
      {
        $lookup: {
          from: 'tweets',
          localField: '_id',
          foreignField: 'tweet',
          as: 'comments',
        },
      },
    ]).sort({ updatedAt: -1 });
    res.json(tweets);
  } catch (error) {
    res.status(404).json({ notweetsfound: 'No tweets found' });
  }
});

router.get('/user/:username', async (req, res) => {
  const { username } = req.params;
  let _id;
  const isValidObjectId = mongoose.isValidObjectId(username);
  if (isValidObjectId) {
    _id = mongoose.Types.ObjectId(username);
  }

  try {
    const user = await User.findOne({ $or: [{ username }, { _id }] });

    const tweets = await Tweet.find({ user: user._id }).sort({ updatedAt: -1 });
    res.json(tweets);
  } catch (error) {
    res.status(404).json({ notweetsfound: 'No tweets found from that user' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.id);
    res.json(tweet);
  } catch (error) {
    res.status(404).json({ notweetfound: 'No tweet found with that ID' });
  }
});

router.get('/:id/comments', async (req, res) => {
  try {
    const tweets = await Tweet.find({ tweet: req.params.id }).sort({
      updatedAt: -1,
    });
    res.json(tweets);
  } catch (error) {
    res.status(404).json({ notweetfound: 'No tweet found with that ID' });
  }
});

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  uploadImage.single('media'),
  async (req, res) => {
    try {
      const { errors, isValid } = validateTweetInput(req.body);

      if (!isValid) {
        console.log('isValid :>> ', isValid);
        throw new Error(JSON.stringify(errors));
      }

      let buffer = null;
      if (req.file) {
        buffer = await sharp(req.file.buffer)
          .resize({ width: 300, height: 300 })
          .png()
          .toBuffer();
      }

      const newTweet = new Tweet({
        tweet: req.body.tweet || null,
        media: buffer,
        text: req.body.text,
        user: req.user.id,
      });

      await newTweet.save();
      res.json(newTweet);
    } catch (error) {
      console.log('error :>> ', error);
    }
  }
);

router.get('/:id/media', async (req, res) => {
  const _id = req.params.id;

  try {
    const tweet = await Tweet.findById(_id);

    if (!tweet || !tweet.media) {
      throw new Error();
    }

    res.set('Content-Type', 'image/png');
    res.send(tweet.media);
  } catch (error) {
    res.status(404).send();
  }
});

router.patch(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpadtes = ['text'];
    const isValidParam = updates.every((update) =>
      allowedUpadtes.includes(update)
    );

    if (!isValidParam) {
      return res.status(400).send('Error: Invalid Update');
    }

    try {
      const tweet = await Tweet.findOne({
        _id: req.params.id,
        user: req.user._id,
      });

      if (!tweet) {
        return res.status(404).send();
      }

      updates.forEach((update) => (tweet[update] = req.body[update]));
      await tweet.save();

      res.send(tweet);
    } catch (error) {
      res.status(400).send();
    }
  }
);

router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const tweet = await Tweet.findOne({
        _id: req.params.id,
        user: req.user.id,
      });

      await Like.deleteMany({ tweet: tweet._id });
      await Tweet.deleteMany({ tweet: tweet._id });
      await tweet.deleteOne();
      if (!tweet) {
        return res.status(404).send();
      }
      res.send(tweet);
    } catch (error) {
      res.status(500).send();
    }
  }
);

router.get('/:id/likes', async (req, res) => {
  try {
    const likes = await Like.find({ tweet: req.params.id });
    res.send(likes);
  } catch (error) {
    res.status(500).send();
  }
});

router.post(
  '/:id/likes',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const like = await Like.findOne({
        tweet: req.params.id,
        user: req.user.id,
      });
      if (like) {
        throw new Error('You already like this tweet');
      } else {
        const newLike = new Like({
          tweet: req.params.id,
          user: req.user.id,
        });

        await newLike.save();

        res.send(newLike);
      }
    } catch (error) {
      res.status(500).send(error);
    }
  }
);

router.delete(
  '/:id/likes',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const like = await Like.findOneAndDelete({
        tweet: req.params.id,
        user: req.user.id,
      });
      if (!like) {
        return res.status(404).send();
      }
      res.send(like);
    } catch (error) {
      res.status(500).send();
    }
  }
);

module.exports = router;
