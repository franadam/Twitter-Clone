import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaTwitter } from 'react-icons/all';

import formStyle from '../FormFiled/FormField.module.css';
import classes from './SignIn.module.css';

import FormField from '../FormFiled/FormField';
import Modal from '../../hoc/Modal/Modal';
import validate from '../../utils/validateForm';
import ShowPasswordField from '../FormFiled/ShowPasswordField';

import { login } from '../../store/actions';

class SignIn extends React.Component {
  state = {
    formError: false,
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
    if (this.props.token) this.props.history.push('/home');
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

    newElement.value = event.target.value;

    const element = event.target;

    newElement.value = element.value;

    const [valid, validationMessage] = validate(newElement);
    newElement.valid = valid;
    newElement.validationMessage = validationMessage;

    if (element.value === '') {
      element.classList.add(formStyle.empty);
    } else {
      element.classList.remove(formStyle.empty);
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
    document.getElementById('myModal').style.display = 'block';
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
      this.props.onLogin(dataToSubmit);
      this.formSuccesManager();
      this.props.history.push('/home');
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
          LOGIN IN
        </button>
      </form>
    );

    if (this.props.error) {
      document.getElementById('myModal').style.display = 'block';
    }

    return (
      <div className={classes.main}>
        <div className={classes.wrapper}>
          <h1>
            <FaTwitter size="4rem" />
          </h1>
          {form}
          <Modal>
            {!!this.props.error ? (
              <p className={classes.error}>{this.props.error.message}</p>
            ) : null}
            {!!this.state.formSuccess ? (
              <p className={classes.success}>{this.state.formSuccess}</p>
            ) : null}
          </Modal>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ auth, error }) => {
  return {
    error: error.auth,
    token: auth.token,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onLogin: (user) => dispatch(login(user)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SignIn));
