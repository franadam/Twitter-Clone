import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import FormField from '../FormFiled/FormField';
import ShowPasswordField from '../FormFiled/ShowPasswordField';
import Modal from '../../hoc/Modal/Modal';

import formStyle from '../FormFiled/FormField.module.css';
import classes from './SignIn.module.css';

import validate from '../../utils/validateForm';
import { signup } from '../../store/actions';
import { FaTwitter } from 'react-icons/fa';

class SignUp extends React.Component {
  state = {
    currentStep: 1,
    formError: false,
    formSuccess: '',
    formValid: false,
    formData: {
      fullname: {
        element: 'input',
        value: '',
        config: {
          name: 'fullname',
          type: 'text',
          placeholder: 'Enter your fullname',
        },
        validation: {
          required: true,
        },
      },
      email: {
        element: 'input',
        value: '',
        config: {
          name: 'email',
          type: 'email',
          placeholder: 'Enter your email',
        },
        validation: {
          required: true,
          email: true,
        },
      },
      username: {
        element: 'input',
        value: '',
        config: {
          name: 'username',
          type: 'text',
          placeholder: 'Enter your username',
        },
        validation: {
          required: true,
        },
      },
      password: {
        element: 'input',
        value: '',
        config: {
          name: 'password',
          type: 'password',
          placeholder: 'Enter your password',
        },
        validation: {
          required: true,
          minLength: [true, 8],
          hasUpperCase: true,
          hasLowerCase: true,
          hasSpecialChar: true,
          hasNumber: true,
        },
        score: 0,
      },
      password_confirmation: {
        element: 'input',
        value: '',
        config: {
          name: 'password_confirmation',
          type: 'password',
          placeholder: 'Enter your password',
        },
        validation: {
          required: true,
          minLength: 8,
        },
      },
      birth_date: {
        element: 'input',
        value: '',
        config: {
          name: 'birth_date',
          type: 'date',
          placeholder: 'Enter your birth date',
          max: new Date().toISOString().substring(0, 10),
          min: new Date('1920').toISOString().substring(0, 10),
        },
        validation: {
          required: true,
        },
      },
    },
  };

  createForm = (formData) => {
    const formElementsArray = [];
    for (let key in formData) {
      formElementsArray.push({
        id: key,
        config: formData[key],
      });
    }

    const formularField = formElementsArray.map((elem) => (
      <div className={formStyle.field} key={elem.id}>
        <label htmlFor={elem.id} className={formStyle.label}>
          {elem.id.replace('_', ' ')}
        </label>
        <FormField
          id={elem.id}
          field={elem.config}
          change={(event) => this.formFieldHandler(event)}
        />
      </div>
    ));

    return formularField;
  };

  formFieldHandler = ({ event, id }) => {
    const newFormData = { ...this.state.formData };
    const newElement = { ...newFormData[id] };

    const element = event.currentTarget;

    newElement.value = element.value;

    const [valid, validationMessage] = validate(newElement);
    newElement.valid = valid;
    newElement.validationMessage = validationMessage;

    if (
      (event.target.value === '' && newElement.validation.required) ||
      (newElement.validation && !newElement.valid)
    ) {
      element.classList.add(formStyle.empty);
      element.parentElement.classList.add(formStyle.empty);
    } else {
      element.classList.remove(formStyle.empty);
      element.parentElement.classList.remove(formStyle.empty);
    }

    if (id === 'password_confirmation') {
      if (
        element.value !== '' &&
        element.value !== newFormData.password.value
      ) {
        newElement.validationMessage = 'The passwords must be identical';
        newElement.valid = false;
      }
    }

    newFormData[id] = newElement;

    this.setState({
      formData: newFormData,
      formError: false,
    });
  };

  formSuccesManager = (type) => {
    const newFormData = { ...this.state.formData };

    for (let key in newFormData) {
      newFormData[key].value = '';
      newFormData[key].valid = false;
      newFormData[key].validationMessage = '';
    }

    this.clearSuccesMessage();

    this.setState({
      formData: newFormData,
      formError: false,
      formSuccess: type ? 'Congratulation' : 'This user already exists',
    });
  };

  clearSuccesMessage = () => {
    setTimeout(() => {
      this.setState({ formSuccess: '' });
    }, 2000);
  };

  handleSubmit = (event) => {
    event.preventDefault();

    const dataToSubmit = {};
    let isValid = true;

    for (let key in this.state.formData) {
      dataToSubmit[key] = this.state.formData[key].value;
      isValid = isValid && this.state.formData[key].valid;
    }

    if (isValid) {
      this.props.onSignup(dataToSubmit);
      this.props.history.push('/signin');
    } else {
      this.setState({ formError: true });
      document.getElementById('myModal').style.display = 'block';
    }
  };

  render() {
    const form = (
      <form className={formStyle.form} onSubmit={this.handleSubmit}>
        {this.createForm(this.state.formData)}
        <ShowPasswordField />
        <button
          className={`${formStyle.btn} ${formStyle.submit}`}
          onClick={(event) => this.handleSubmit(event)}
          type="submit"
        >
          SIGN UP
        </button>
      </form>
    );

    return (
      <div className={classes.main}>
        <div className={classes.wrapper}>
          <h1>
            <FaTwitter size="4rem" />
          </h1>
          {form}
          <Modal>
            {this.state.formError ? (
              <p className={classes.error}>Please fill all fields properly</p>
            ) : null}
          </Modal>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ error }) => {
  return {
    error: error.auth,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSignup: (credential) => dispatch(signup(credential)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SignUp));
