const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const sharp = require('sharp');

const User = require('../../models/User');

const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');
const uploadImage = require('../../services/loader');
const router = express.Router();

router.get('/:username', async (req, res) => {
  //const user = await User.findOne({ username: req.params.username });

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
});

router.get('/:id/avatar', async (req, res) => {
  const username = req.params.id;
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
    const user = await User.findOne({ username: req.body.username });
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
  console.log('req.body :>> ', JSON.stringify(req.body));
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
    res.status(400).json(errors);
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

module.exports = router;
