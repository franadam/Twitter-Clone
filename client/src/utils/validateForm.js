import validator from 'validator';

const validate = (element) => {
  let error = [true, ''];

  if (element.validation.email) {
    const valid = validator.isEmail(element.value);
    const message = `${!valid ? 'Please enter a valid email' : ''}`;
    error = !valid ? [valid, message] : error;
  }

  if (element.validation.required) {
    const valid = element.value.trim() !== '';
    const message = `${
      !valid ? `The ${element.config.name} field is required` : ''
    }`;
    error = !valid ? [valid, message] : error;
  }

  if (element.config.name === 'password') {
    let valid, message;

    const value = element.value.trim();
    const {
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasSpecialChar,
      hasNumber,
    } = element.validation;
    if (minLength[0]) {
      valid = value.length >= minLength[1];
      console.log('minLength', valid);
      message = `${
        !valid
          ? `${element.config.name} must have at least ${minLength[1]} caracters`
          : ''
      }`;
      error = !valid ? [valid, message] : error;
    }
    if (hasUpperCase) {
      const upperCaseLetters = /[A-Z]/g;
      valid = upperCaseLetters.test(value);
      console.log('hasUpperCase :>> ', valid);
      message = `${
        !valid
          ? `${element.config.name} must contain at least 1 uppercase  caracters`
          : ''
      }`;
      error = !valid ? [valid, message] : error;
    }
    if (hasLowerCase) {
      const lowerCaseLetters = /[a-z]/g;
      valid = lowerCaseLetters.test(value);
      console.log('hasLowerCase :>> ', valid);
      message = `${
        !valid
          ? `${element.config.name} must contain at least 1 lowercase  caracters`
          : ''
      }`;
      error = !valid ? [valid, message] : error;
    }
    if (hasSpecialChar) {
      const specialCharacters = /\W/g;
      valid = specialCharacters.test(value);
      console.log('hasSpecialChar :>> ', valid);
      message = `${
        !valid
          ? `${element.config.name} must contain at least 1 special  caracters`
          : ''
      }`;
      error = !valid ? [valid, message] : error;
    }
    if (hasNumber) {
      const numbers = /[0-9]/g;
      valid = numbers.test(value);
      console.log('hasNumber', valid);
      message = `${
        !valid ? `${element.config.name} must contain at least 1 number` : ''
      }`;
      error = !valid ? [valid, message] : error;
    }
  }
  return error;
};

export const showPassword = () => {
  const x = document.getElementById('password');
  if (x.type === 'password') {
    x.type = 'text';
  } else {
    x.type = 'password';
  }
};

export default validate;

window.validator = validator;
