import React from 'react';
import { connect } from 'react-redux';
import TweetBox from './TweetBox';

import { createNewTweet } from '../../store/actions';

import classes from './CreateTweet.module.css';
import formStyle from '../FormFiled/FormField.module.css';

class CreateTweet extends React.Component {
  state = {
    text: '',
    newTweet: {},
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const tweet = {
      text: this.state.text,
      user: this.props.userID,
    };

    this.props.onCreateNewTweet(tweet);
    this.setState({ text: '', newTweet: tweet });
  };

  changeHandler = (e) => {
    this.setState({
      text: e.currentTarget.value,
    });
  };

  render() {
    const form = (
      <form className={formStyle.form} onSubmit={this.handleSubmit}>
        <input
          type="textarea"
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
        {this.state.error ? this.renderError() : null}
      </form>
    );

    return (
      <div className={classes.main}>
        <div className={classes.wrapper}>
          {form}
          <TweetBox text={this.state.newTweet.text} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userID: state.user.userID,
    newTweet: state.tweet.new,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onCreateNewTweet: (data) => dispatch(createNewTweet(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateTweet);
