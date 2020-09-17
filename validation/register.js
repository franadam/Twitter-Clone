const Validator = require('validator');
const validText = require('./valid-text');

module.exports = function validateRegisterInput(data) {
  let errors = {};

  data.username = validText(data.username) ? data.username : '';
  data.fullname = validText(data.fullname) ? data.fullname : '';
  data.email = validText(data.email) ? data.email : '';
  data.password = validText(data.password) ? data.password : '';
  data.password_confirmation = validText(data.password_confirmation)
    ? data.password_confirmation
    : '';
  data.birth_date = new Date(data.birth_date).toISOString().substring(0, 10);

  if (Validator.isEmpty(data.fullname)) {
    errors.fullname = 'Fullname field is required';
  }

  if (!Validator.isLength(data.username, { min: 2, max: 30 })) {
    errors.username = 'Handle must be between 2 and 30 characters';
  }

  if (Validator.isEmpty(data.username)) {
    errors.username = 'Username field is required';
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = 'Email field is required';
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = 'Email is invalid';
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password field is required';
  }

  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (Validator.isEmpty(data.password_confirmation)) {
    errors.password_confirmation = 'Confirm Password field is required';
  }

  if (!Validator.equals(data.password, data.password_confirmation)) {
    errors.password_confirmation = 'Passwords must match';
  }

  if (!data.birth_date) {
    errors.birth_date = 'birth_date field is required';
  }

  if (
    !Validator.isBefore(
      data.birth_date,
      new Date().toISOString().substring(0, 10)
    )
  ) {
    errors.birth_date = 'birth_date must be before today';
  }

  if (
    !Validator.isAfter(
      data.birth_date,
      new Date('1920').toISOString().substring(0, 10)
    )
  ) {
    errors.birth_date = 'birth_date must be after 1920';
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};
