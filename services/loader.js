const multer = require('multer');

const uploadImage = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, callback) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return callback(new Error('Please load a image file '));
    }

    callback(undefined, true);
  },
});

module.exports = uploadImage;
