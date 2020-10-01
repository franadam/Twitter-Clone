import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';

import FormField from '../FormFiled/FormField';
import Modal from '../../hoc/Modal/Modal';

import formStyle from '../FormFiled/FormField.module.css';
import classes from './Picture.module.css';

import validate from '../../utils/validateForm';
import { signup } from '../../store/actions';

class SignUp extends Component {
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
      bio: {
        element: 'input',
        value: '',
        config: {
          name: 'bio',
          type: 'text',
          placeholder: 'Say something about you',
        },
        validation: {
          required: false,
        },
      },
      location: {
        element: 'input',
        value: '',
        config: {
          name: 'location',
          type: 'text',
          placeholder: 'Enter your location',
        },
        validation: {
          required: false,
        },
      },
      website: {
        element: 'input',
        value: '',
        config: {
          name: 'website',
          type: 'text',
          placeholder: 'Enter your website',
        },
        validation: {
          required: false,
        },
      },
      avatar: {
        element: 'input',
        value: '',
        config: {
          name: 'avatar',
          type: 'file',
          placeholder: 'Choose your avatar',
        },
        validation: {
          required: false,
        },
      },
      cover: {
        element: 'input',
        value: '',
        config: {
          name: 'cover',
          type: 'file',
          placeholder: 'Choose your cover',
        },
        validation: {
          required: false,
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

    if (id === 'password_confirmation') {
      if (
        element.value !== '' &&
        element.value !== newFormData.password.value
      ) {
        newElement.validationMessage = 'The passwords must be identical';
        newElement.valid = false;
      }
    }

    if (element.config.type === 'file') {
      if (element.files && element.files[0]) {
        newElement.value = element.files[0];
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
      this.props.signup(dataToSubmit);
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
        <button
          className={formStyle.btn}
          onClick={(event) => this.handleSubmit(event)}
          type="submit"
        >
          UPDATE
        </button>
      </form>
    );

    return (
      <div className={classes.main}>
        <div className={classes.wrapper}>
          <h1>Edit Profile</h1>
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SignUp));
