const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })
.then(() => console.log("Connected to MongoDB successfully"))
.catch(err => console.log(err));

const app = express()
const port = process.env.PORT || 5000;

app.get('/', (res, req) => res.send('Hello World'))

app.listen(port, () => console.log(`Server is running on port ${port}`));