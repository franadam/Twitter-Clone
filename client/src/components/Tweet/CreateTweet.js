import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { FaImage } from 'react-icons/fa';
import PropTypes from 'prop-types';

import axios from 'axios';

import { createNewTweet } from '../../store/actions';

import TweetBox from './TweetBox';
import Avatar from '../UI/Avatar/Avatar';

import classes from './CreateTweet.module.css';

class CreateTweet extends React.Component {
  state = {
    tweet: null,
    tweetID: '',
    text: '',
    newTweet: {},
    media: '',
  };

  componentDidMount = () => {
    const { state } = this.props.location;
    if (state) {
      const { tweet: tweetID } = state,
        tweet = this.props.tweets.find((tweet) => tweet._id === tweetID);
      this.setState({ tweetID, tweet });
      // This.getTweet(tweetID);
    }
  };

  getTweet = async (tweetID) => {
    try {
      const res = await axios.get(`/api/tweets/${tweetID}`),
        tweet = res.data;
      this.setState({ tweet });
    } catch (error) {
      console.log('error :>> ', error);
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(),
      tweet = {
        media: this.state.media || null,
        tweet: this.state.tweetID,
        text: this.state.text,
        user: this.props.userID,
      };

    for (const key in tweet) {
      formData.append(key, tweet[key]);
    }

    this.props.onCreateNewTweet(formData);
    this.setState({ text: '', newTweet: tweet });
    if (this.props.match.url === '/compose/tweet') {
      this.props.history.goBack();
    } else {
      this.props.history.go(0);
    }
  };

  onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const media = event.target.files[0];
      this.setState({
        media,
      });
    }
  };

  deleteMedia = (e) => {
    e.stopPropagation();
    this.setState({
      media: '',
    });
  };

  changeHandler = (e) => {
    this.setState({
      text: e.currentTarget.value,
    });
  };

  render() {
    const { tweet, newTweet, media } = this.state,
      { users, userID } = this.props,
      user = tweet ? users.find((user) => user._id === tweet.user) : {},
      me = users ? users.find((user) => user._id === userID) : {};

    if (!me) {
      return null;
    }

    const form = (
      <form className={classes.form} onSubmit={this.handleSubmit}>
        <input
          onChange={(event) => this.changeHandler(event)}
          placeholder="What's happening ?"
          type="textarea"
          value={this.state.text}
        />
        {media ? (
          <div
            className={classes.media}
            onClick={(event) => this.showImage(event)}
          >
            <div className={classes.close}>
              <span onClick={(event) => this.deleteMedia(event)}>&times;</span>
            </div>
            <img src={URL.createObjectURL(media)} alt="media" />
          </div>
        ) : null}
        <div className={classes.btns_container}>
          <div>
            <div>
              <div
                className={classes.btns_picture}
                onClick={() => document.getElementById('picture_input').click()}
                role="button"
              >
                <FaImage size="2rem" />
              </div>
              <input
                className={classes.picture__input}
                id="picture_input"
                name="picture_input"
                onChange={(event) => this.onImageChange(event)}
                type="file"
              />
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
    return (
      <div className={classes.main}>
        <div className={classes.wrapper}>
          {tweet ? (
            <>
              <TweetBox
                comments={tweet.comments || []}
                date={tweet.updatedAt || ''}
                id={tweet._id}
                likes={tweet.likes || []}
                media={tweet.media}
                text={tweet.text}
                userID={tweet.user}
              />
              <div className={classes.reply}>
                Reply to
                <Link to={`users/${user.username}`}> @{user.username}</Link>
              </div>
            </>
          ) : null}
          <div className={classes.compose}>
            <Link to={`/users/${userID}`}>
              <Avatar avatar={me.avatar} size="4rem" userID={userID} />
            </Link>
            <div className={classes.form}>{form}</div>
          </div>
          {newTweet._id ? (
            <TweetBox
              comments={newTweet.comments || []}
              date={newTweet.updatedAt || ''}
              id={newTweet._id}
              key={newTweet._id}
              likes={newTweet.likes || []}
              media={newTweet.media || ''}
              text={newTweet.text}
              userID={newTweet.user}
            />
          ) : null}
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ tweet, auth, user, error }) => ({
    userID: auth.userID,
    tweets: tweet.tweets,
    newTweet: tweet.new,
    users: user.users,
    error: error.tweet,
  }),
  mapDispatchToProps = (dispatch) => ({
    onCreateNewTweet: (data) => dispatch(createNewTweet(data)),
  });

CreateTweet.propTypes = {
  userID: PropTypes.string,
  history: PropTypes.object,
  match: PropTypes.object,
  location: PropTypes.object,
  error: PropTypes.object,
  newTweet: PropTypes.object,
  tweets: PropTypes.arrayOf(PropTypes.object),
  users: PropTypes.arrayOf(PropTypes.object),
  onCreateNewTweet: PropTypes.func,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(CreateTweet));
