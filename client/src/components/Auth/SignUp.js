import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import FormField from '../FormFiled/FormField';

import { signup } from '../../store/actions';
import formStyle from '../FormFiled/FormField.module.css';
import classes from './SignIn.module.css';

class SignUp extends React.Component {
  state = {
    currentStep: 1,
    formError: false,
    formSuccess: '',
    formValid: false,
    error: null,
    formData: {
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
          minLength: false,
          hasUpperCase: false,
          hasLowerCase: false,
          hasSpecialChar: false,
          hasNumber: false,
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

  componentDidMount = () => {
    console.log('signUp :>> ', 'signUp');
  };
  // Once the user has been authenticated, redirect to the Tweets page
  componentWillReceiveProps = (nextProps) => {
    if (nextProps.currentUser === true) {
      this.props.history.push('/tweets');
    }

    // Set or clear error
    this.setState({ error: nextProps.error });
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

  formFieldHandler = (element) => {
    const newFormData = { ...this.state.formData };
    const newElement = { ...newFormData[element.id] };

    newElement.value = element.event.target.value;

    newFormData[element.id] = newElement;

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

    for (let key in this.state.formData) {
      dataToSubmit[key] = this.state.formData[key].value;
    }

    this.props.signup(dataToSubmit);
    //this.setState({ formError: true });
  };

  // Render the session error if there are any
  renderError = () => {
    return (
      <ul>
        {Object.keys(this.state.error).map((error, i) => (
          <li key={`error-${i}`}>{this.state.error[error]}</li>
        ))}
      </ul>
    );
  };

  render() {
    const form = (
      <form className={formStyle.form} onSubmit={this.handleSubmit}>
        {this.createForm(this.state.formData)}
        <button
          className={formStyle.btn}
          onClick={(event) => this.handleSubmit(event)}
          type="submit"
        >
          SIGN UP
        </button>
        {this.state.error ? this.renderError() : null}
      </form>
    );

    return (
      <div className={classes.main}>
        <div className={classes.wrapper}>
          <h1>Twitter</h1>
          {form}
          <Link to="/signin" className={classes.link}>
            SIGN IN
          </Link>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ user }) => {
  console.log('user :>> ', user);
  return {
    error: user.error,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    signup: (user) => dispatch(signup(user)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
