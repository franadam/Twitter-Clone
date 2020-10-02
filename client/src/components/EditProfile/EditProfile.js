import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';

import FormField from '../FormFiled/FormField';
import Modal from '../../hoc/Modal/Modal';

import formStyle from '../FormFiled/FormField.module.css';
import classes from './EditProfile.module.css';

import validate from '../../utils/validateForm';
import { updateProfile } from '../../store/actions';
import Avatar from '../UI/Avatar/Avatar';
import Cover from '../UI/Cover/Cover';

class EditProfile extends Component {
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
          required: false,
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

    if (newElement.config.type === 'file') {
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

    const { formData } = this.state;
    const formToSubmit = new FormData();
    const dataToSubmit = {};
    let isValid = true;

    for (let key in formData) {
      if (formData[key].value) {
        dataToSubmit[key] = formData[key].value;
        isValid = isValid && formData[key].valid;
      }
    }

    for (let key in dataToSubmit) {
      formToSubmit.append(key, dataToSubmit[key]);
    }

    if (isValid) {
      this.props.onUpdateProfile(this.props.userID, formToSubmit);
      this.props.history.push(`users/${this.props.userID}`);
    } else {
      this.setState({ formError: true });
      document.getElementById('myModal').style.display = 'block';
    }
  };

  render() {
    const { userID, match, users } = this.props;
    const { username } = match.params;
    const user = users.find(
      (user) => user._id === username || user.username === username
    );

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

    if (!user) {
      return null;
    }

    return (
      <div className={classes.main}>
        <div className={classes.wrapper}>
          <h1>Edit Profile</h1>
          <div className={classes.header}>
            <div className={classes.images}>
              <Cover cover={user.cover} userID={userID} />{' '}
              <Avatar
                avatar={user.avatar}
                userID={userID}
                position="absolute"
              />
            </div>
          </div>
          <div className={classes.form}>{form}</div>
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

const mapStateToProps = ({ error, auth, user }) => {
  return {
    userID: auth.userID,
    users: user.users,
    loggedIn: !!auth.token,
    error: error.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onUpdateProfile: (id, user) => dispatch(updateProfile(id, user)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(EditProfile));
