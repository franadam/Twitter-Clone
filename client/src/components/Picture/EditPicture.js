import React, { Component } from 'react';
import { connect } from 'react-redux';
import { uploadAvatar } from '../../store/actions';
import formStyle from '../FormFiled/FormField.module.css';

class EditPicture extends Component {
  state = {};

  changeHandler = (event) => {
    const selectedFile = event.target.files[0];
    this.setState({ selectedFile });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData();
    data.append('file', this.state.selectedFile);
    this.props.onUploadAvatar(this.props.userID, data);
  };

  render() {
    const form = (
      <form className={formStyle.form}>
        <label htmlFor="avatar">Avatar</label>
        <input
          type="file"
          id="avatar"
          name="avatar"
          onChange={(event) => this.changeHandler(event)}
          placeholder="What's happening ?"
        />
        <button
          className={formStyle.btn}
          onClick={(event) => this.handleSubmit(event)}
          type="submit"
        >
          TWEET
        </button>
        <label htmlFor="cover">Avatar</label>
        <input
          type="file"
          id="cover"
          name="cover"
          value={this.state.text}
          onChange={(event) => this.changeHandler(event)}
          placeholder="What's happening ?"
        />
        <button
          className={formStyle.btn}
          onClick={(event) => this.handleSubmit(event)}
          type="submit"
        >
          TWEET
        </button>
      </form>
    );
    return <div>{form}</div>;
  }
}

const mapStateToProps = ({ user }) => {
  console.log('state :>> ', { user });
  return {
    user: user.user,
    userID: user.userID,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onUploadAvatar: (username, avatar) =>
      dispatch(uploadAvatar(username, avatar)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditPicture);
