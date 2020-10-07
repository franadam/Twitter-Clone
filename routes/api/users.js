const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const sharp = require('sharp');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const User = require('../../models/User');
const Tweet = require('../../models/Tweet');
const Like = require('../../models/Like');

const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');
const uploadImage = require('../../services/loader');
const Follow = require('../../models/Follow');
const router = express.Router();

router.get('/:username', async (req, res) => {
  try {
    const { username } = req.params;
    let _id;
    const isValidObjectId = mongoose.isValidObjectId(username);
    if (isValidObjectId) {
      _id = mongoose.Types.ObjectId(username);
    }
    const users = await User.aggregate([
      { $match: { $or: [{ username }, { _id }] } },
      {
        $lookup: {
          from: 'likes',
          let: { userID: '$_id' },
          pipeline: [
            { $match: { $expr: { $eq: ['$$userID', '$user'] } } },
            {
              $lookup: {
                from: 'tweets',
                let: { tweet: '$tweet' },
                pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$tweet'] } } }],
                as: 'tweets',
              },
            },
            { $unwind: '$tweets' },
            { $project: { _id: 0, tweets: 1 } },
            { $sort: { createdAt: -1 } },
          ],
          as: 'likes',
        },
      },
      {
        $lookup: {
          from: 'tweets',
          let: { userID: '$_id' },
          pipeline: [
            { $match: { $expr: { $eq: ['$$userID', '$user'] } } },
            {
              $lookup: {
                from: 'tweets',
                let: { tweetID: '$_id' },
                pipeline: [
                  { $match: { $expr: { $eq: ['$tweet', '$$tweetID'] } } },
                ],
                as: 'comments',
              },
            },
            { $sort: { createdAt: -1 } },
          ],
          as: 'tweets',
        },
      },
      {
        $lookup: {
          from: 'follows',
          localField: '_id',
          foreignField: 'follower',
          as: 'following',
        },
      },
      {
        $lookup: {
          from: 'follows',
          localField: '_id',
          foreignField: 'followed',
          as: 'followers',
        },
      },
      { $project: { password: 0, birth_date: 0 } },
    ]);

    res.send(users[0]);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/:username/avatar', async (req, res) => {
  const { username } = req.params;
  let _id;
  const isValidObjectId = mongoose.isValidObjectId(username);
  if (isValidObjectId) {
    _id = mongoose.Types.ObjectId(username);
  }

  try {
    const user = await User.findOne({ $or: [{ username }, { _id }] });

    if (!user || !user.avatar) {
      throw new Error();
    }

    res.set('Content-Type', 'image/png');
    res.send(user.avatar);
  } catch (error) {
    res.status(404).send();
  }
});

router.post(
  '/:id/avatar',
  passport.authenticate('jwt', { session: false }),
  uploadImage.single('avatar'),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.delete(
  '/:id/avatar',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      req.user.avatar = null;
      await req.user.save();
      res.send();
    } catch (error) {
      res.status(500).send();
    }
  }
);

router.get('/:username/cover', async (req, res) => {
  const { username } = req.params;
  let _id;
  const isValidObjectId = mongoose.isValidObjectId(username);
  if (isValidObjectId) {
    _id = mongoose.Types.ObjectId(username);
  }

  try {
    const user = await User.findOne({ $or: [{ username }, { _id }] });

    if (!user || !user.cover) {
      throw new Error();
    }

    res.set('Content-Type', 'image/png');
    res.send(user.cover);
  } catch (error) {
    res.status(404).send();
  }
});

router.post(
  '/:id/cover',
  passport.authenticate('jwt', { session: false }),
  uploadImage.single('cover'),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 500, height: 250 })
      .png()
      .toBuffer();
    req.user.cover = buffer;
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.delete(
  '/:id/cover',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      req.user.cover = null;
      await req.user.save();
      res.send();
    } catch (error) {
      res.status(500).send();
    }
  }
);

router.post('/register', async (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  try {
    if (!isValid) {
      throw new Error(JSON.stringify(errors));
    }
    const user = await User.findOne({
      $or: [{ username: req.body.username }, { email: req.body.email }],
    });
    if (user) {
      errors.username = 'User already exists';
      throw new Error(errors.username);
    } else {
      const newUser = new User({
        username: req.body.username,
        fullname: req.body.fullname,
        email: req.body.email,
        password: req.body.password,
        birth_date: req.body.birth_date,
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, async (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          await newUser.save();
          const payload = { id: newUser.id, username: newUser.username };

          jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: 3600 },
            (err, token) => {
              res.json({
                user: newUser,
                success: true,
                token: 'Bearer ' + token,
              });
            }
          );
        });
      });
    }
    //res.redirect('/');
  } catch (error) {
    res.status(400).json(errors);
  }
});

router.patch(
  '/:username',
  passport.authenticate('jwt', { session: false }),
  uploadImage.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'cover', maxCount: 1 },
  ]),
  async (req, res) => {
    //const { errors, isValid } = validateRegisterInput(req.body);
    const updates = {};
    const { username } = req.params;
    let _id;
    const isValidObjectId = mongoose.isValidObjectId(username);
    if (isValidObjectId) {
      _id = mongoose.Types.ObjectId(username);
    }

    for (let key in req.body) {
      if (req.body[key]) {
        updates[key] = req.body[key];
      }
    }
    //console.log('req.bodys :>> ', req.body);
    try {
      //if (req.user.id === username || req.user.username === username) {} else throw new Error('Unauthorized ');

      const user = await User.findOneAndUpdate(
        { $or: [{ username }, { _id }] },
        updates
      );

      if (!user) {
        throw new Error('User does not exists');
      }
      let buffer = null;

      if (req.files) {
        let size;
        for (let key in req.files) {
          size =
            key === 'cover'
              ? { width: 500, height: 250 }
              : { width: 300, height: 300 };
          buffer = await sharp(req.files[key][0].buffer)
            .resize(size)
            .png()
            .toBuffer();
          req.user[key] = buffer;
          await req.user.save();
        }
      }
      res.send(req.user);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  }
);

router.post('/login', async (req, res) => {
  //console.log('req.body :>> ', JSON.stringify(req.body));
  const { errors, isValid } = validateLoginInput(req.body);

  try {
    if (!isValid) {
      throw new Error(JSON.stringify(errors));
    }
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({ email });
    if (!user) {
      errors.email = 'This user does not exist';
      throw new Error(errors.email);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const payload = { id: user.id, username: user.username };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: 3600 },
        (err, token) => {
          res.json({
            userID: user._id,
            success: true,
            token: 'Bearer ' + token,
          });
        }
      );
      //      await user.save();

      //res.redirect('/home');
      //req.session.redirectTo = '/home';
    } else {
      errors.password = 'Incorrect password';
      throw new Error(errors.password);
    }
  } catch (error) {
    console.log('login user error :>> ', error.message);
    res.status(404).json(error);
  }
});

router.get('/current', async (req, res) => {
  console.log('req.user.id :>> ', req.user.id);
  try {
    const _id = mongoose.Types.ObjectId(req.user.id);
    const users = await User.aggregate([
      { $match: { _id } },
      {
        $lookup: {
          from: 'likes',
          let: { userID: '$_id' },
          pipeline: [
            { $match: { $expr: { $eq: ['$$userID', '$user'] } } },
            {
              $lookup: {
                from: 'tweets',
                let: { tweet: '$tweet' },
                pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$tweet'] } } }],
                as: 'tweets',
              },
            },
            { $unwind: '$tweets' },
            { $project: { _id: 0, tweets: 1 } },
            { $sort: { createdAt: -1 } },
          ],
          as: 'likes',
        },
      },
      {
        $lookup: {
          from: 'tweets',
          let: { userID: '$_id' },
          pipeline: [
            { $match: { $expr: { $eq: ['$$userID', '$user'] } } },
            {
              $lookup: {
                from: 'tweets',
                let: { tweetID: '$_id' },
                pipeline: [
                  { $match: { $expr: { $eq: ['$tweet', '$$tweetID'] } } },
                ],
                as: 'comments',
              },
            },
            { $sort: { createdAt: -1 } },
          ],
          as: 'tweets',
        },
      },
      {
        $lookup: {
          from: 'follows',
          localField: '_id',
          foreignField: 'follower',
          as: 'following',
        },
      },
      {
        $lookup: {
          from: 'follows',
          localField: '_id',
          foreignField: 'followed',
          as: 'followers',
        },
      },
      { $project: { password: 0, birth_date: 0 } },
    ]);

    const user = users[0];
    if (!user) throw new Error('not found');
    await user.save();

    res.send(user);
  } catch (error) {
    console.log('error :>> ', error);
    res.status(400).send(error.message);
  }
});

router.delete(
  '/current',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      await req.user.remove();
      res.send(req.user);
    } catch (error) {
      res.status(500).send();
    }
  }
);

router.get('/:id/likes', async (req, res) => {
  const username = req.params.id;
  //{ $match: { id: _id } },
  try {
    const likes = await User.aggregate([
      { $match: { username } },
      {
        $lookup: {
          from: 'likes',
          let: { userID: '$_id' },
          pipeline: [
            { $match: { $expr: { $eq: ['$$userID', '$user'] } } },
            {
              $lookup: {
                from: 'tweets',
                let: { tweet: '$tweet' },
                pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$tweet'] } } }],
                as: 'tweets',
              },
            },
            { $unwind: '$tweets' },
            { $project: { _id: 0, tweets: 1 } },
            { $sort: { createdAt: -1 } },
          ],
          as: 'likes',
        },
      },
      {
        $lookup: {
          from: 'tweets',
          localField: '_id',
          foreignField: 'user',
          as: 'tweets',
        },
      },
    ]);
    res.send(likes);
  } catch (error) {
    res.status(500).send();
  }
});

router.get('/', async (req, res) => {
  try {
    const users = await User.aggregate([
      {
        $lookup: {
          from: 'likes',
          let: { userID: '$_id' },
          pipeline: [
            { $match: { $expr: { $eq: ['$$userID', '$user'] } } },
            {
              $lookup: {
                from: 'tweets',
                let: { tweet: '$tweet' },
                pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$tweet'] } } }],
                as: 'tweets',
              },
            },
            { $unwind: '$tweets' },
            { $project: { _id: 0, tweets: 1 } },
            { $sort: { createdAt: -1 } },
          ],
          as: 'likes',
        },
      },
      {
        $lookup: {
          from: 'tweets',
          let: { userID: '$_id' },
          pipeline: [
            { $match: { $expr: { $eq: ['$$userID', '$user'] } } },
            {
              $lookup: {
                from: 'tweets',
                let: { tweetID: '$_id' },
                pipeline: [
                  { $match: { $expr: { $eq: ['$tweet', '$$tweetID'] } } },
                ],
                as: 'comments',
              },
            },
            { $sort: { createdAt: -1 } },
          ],
          as: 'tweets',
        },
      },
      {
        $lookup: {
          from: 'follows',
          localField: '_id',
          foreignField: 'follower',
          as: 'following',
        },
      },
      {
        $lookup: {
          from: 'follows',
          localField: '_id',
          foreignField: 'followed',
          as: 'followers',
        },
      },
      { $project: { password: 0, birth_date: 0 } },
    ]);

    res.send(users);
  } catch (error) {
    res.status(500).send();
  }
});

router.get('/:username/follows', async (req, res) => {
  try {
    const { username } = req.params;
    let _id;
    const isValidObjectId = mongoose.isValidObjectId(username);
    if (isValidObjectId) {
      _id = mongoose.Types.ObjectId(username);
    }
    const followers = await User.aggregate([
      { $match: { $or: [{ username }, { _id }] } },
      {
        $lookup: {
          from: 'follows',
          localField: '_id',
          foreignField: 'follower',
          as: 'following',
        },
      },
      {
        $lookup: {
          from: 'follows',
          localField: '_id',
          foreignField: 'followed',
          as: 'followers',
        },
      },
      { $project: { _id: 1, username: 1, followers: 1, following: 1 } },
    ]).sort({ updatedAt: -1 });
    res.send(followers[0]);
  } catch (error) {
    res.status(500).send();
  }
});

router.post(
  '/:id/follows',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      console.log('req.params.id, :>> ', req.params.id, req.user.id);
      if (req.params.id === req.user.id) {
        console.log('req.params.id === req.user.id');
        throw new Error("You can't follow yourself");
      }
      const following = await Follow.findOne({
        followed: req.params.id,
        follower: req.user.id,
      });
      if (following) {
        throw new Error('You already followed this person');
      } else {
        const newFollowing = new Follow({
          followed: req.params.id,
          follower: req.user.id,
        });

        await newFollowing.save();

        res.send(newFollowing);
      }
    } catch (error) {
      console.log('error :>> ', error);
      res.status(500).send({ error: error.message });
    }
  }
);

router.delete(
  '/:id/follows',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const following = await Follow.findOneAndDelete({
        followed: req.params.id,
        follower: req.user.id,
      });
      res.send(following);
    } catch (error) {
      res.status(500).send(error);
    }
  }
);

module.exports = router;
