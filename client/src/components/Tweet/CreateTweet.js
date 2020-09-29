import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import TweetBox from './TweetBox';

import axios from 'axios';

import { createNewTweet } from '../../store/actions';

import classes from './CreateTweet.module.css';
import formStyle from '../FormFiled/FormField.module.css';
import Avatar from '../UI/Avatar/Avatar';
import { FaImage } from 'react-icons/fa';

class CreateTweet extends React.Component {
  state = {
    tweet: null,
    tweetID: '',
    text: '',
    newTweet: {},
  };

  componentDidMount = () => {
    const { state } = this.props.location;
    if (state) {
      const { tweet: tweetID } = state;
      this.setState({ tweetID });
      this.getTweet(tweetID);
    }
  };

  getTweet = async (tweetID) => {
    try {
      const res = await axios.get(`/api/tweets/${tweetID}`);
      const tweet = res.data;
      this.setState({ tweet });
    } catch (error) {
      console.log('error :>> ', error);
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const tweet = {
      tweet: this.state.tweetID || null,
      text: this.state.text,
      user: this.props.userID,
    };

    this.props.onCreateNewTweet(tweet);
    this.setState({ text: '', newTweet: tweet });
    this.props.history.goBack();
  };

  changeHandler = (e) => {
    this.setState({
      text: e.currentTarget.value,
    });
  };

  render() {
    const form = (
      <form onSubmit={this.handleSubmit}>
        <input
          type="textarea"
          value={this.state.text}
          onChange={(event) => this.changeHandler(event)}
          placeholder="What's happening ?"
        />
        <div className={classes.btns_container}>
          <div>
            <div className={classes.btns_picture}>
              <FaImage size="2rem" />
            </div>
          </div>
          <div className={classes.btn}>
            <button onClick={(event) => this.handleSubmit(event)} type="submit">
              Tweet
            </button>
          </div>
        </div>
        {this.state.error ? this.renderError() : null}
      </form>
    );
    const { tweet, newTweet } = this.state;

    return (
      <div className={classes.main}>
        <div className={classes.wrapper}>
          {tweet ? (
            <>
              <TweetBox
                id={tweet._id}
                userID={tweet.user}
                text={tweet.text}
                date={tweet.updatedAt || ''}
              />
              Reply to @{tweet.user}
            </>
          ) : null}
          <div className={classes.compose}>
            <Link to={`/users/${this.props.userID}`}>
              <Avatar avatar={this.props.userID} userID={this.props.userID} />
            </Link>
            <div className={classes.form}>{form}</div>
          </div>
          {newTweet._id ? (
            <TweetBox
              key={newTweet._id}
              id={newTweet._id}
              userID={newTweet.user}
              text={newTweet.text}
              date={newTweet.updatedAt || ''}
            />
          ) : null}
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(CreateTweet));
