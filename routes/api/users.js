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
const router = express.Router();

router.get('/:username', async (req, res) => {
  const username = req.params.username;
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
    ]);

    let user;
    if (mongoose.isValidObjectId(username)) {
      user = users.find((u) => u._id == username);
    } else {
      user = users.find((u) => u.username === username);
    }
    //console.log('user', user);
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
  /*
  const user =
    (await User.findOne({ username: req.params.username })) ||
    (await User.findById(req.params.username));
  const { _id, fullname, username, avatar, cover, createdAt } = user;
  res.json({
    _id,
    fullname,
    username,
    avatar,
    cover,
    createdAt,
  });
  */
});

router.get('/:id/avatar', async (req, res) => {
  const username = req.params.id;

  console.log('username :>> ', username);

  try {
    const user =
      (await User.findOne({ username })) || (await User.findById(username));

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

router.get('/:id/cover', async (req, res) => {
  const username = req.params.id;
  try {
    const user =
      (await User.findOne({ username })) || (await User.findById(username));

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
      console.log('login user :>> ', user);
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
            user,
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

router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    console.log('req :>> ', JSON.stringify(req));
    res.json({
      user: {
        id: req.user.id,
        fullname: req.user.fullname,
        username: req.user.username,
        email: req.user.email,
        password: req.user.password,
        birth_date: req.user.birth_date,
      },
    });
  }
);

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
  console.log('_id :>> ', username);
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
    console.log('likes :>> ', likes);
    res.send(likes);
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;
