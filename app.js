const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB successfully'))
  .catch((err) => console.log(err));

const app = express();
const port = process.env.PORT;

const tweetsRouter = require('./routes/api/tweets');
const usersRouter = require('./routes/api/users');
require('./services/passport')(passport);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use('/api/users', usersRouter);
app.use('/api/tweets', tweetsRouter);

//app.get('/', (req, res) => res.json('Hello World'))

app.listen(port, () => console.log(`Server is running on port ${port}`));
