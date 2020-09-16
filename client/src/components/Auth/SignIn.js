import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import FormField from '../FormFiled/FormField';

import { login } from '../../store/actions';
import formStyle from '../FormFiled/FormField.module.css';
import classes from './SignIn.module.css';

class SignIn extends React.Component {
  state = {
    formError: false,
    error: null,
    formSuccess: '',
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
          minLength: 8,
        },
      },
    },
  };

  componentDidMount = () => {
    console.log('signin :>> ', 'signin');
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

    const formData = this.state.formData;
    const dataToSubmit = {};

    for (let key in formData) {
      dataToSubmit[key] = formData[key].value;
    }

    this.props.login(dataToSubmit);

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
          LOGIN IN
        </button>
        {this.state.error ? this.renderError() : null}
      </form>
    );

    return (
      <div className={classes.main}>
        <div className={classes.wrapper}>
          <h1>Twitter</h1>
          {form}
          <Link to="/signup" className={classes.link}>
            SIGN UP
          </Link>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ user }) => {
  return {
    error: user.error,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    login: (user) => dispatch(login(user)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
