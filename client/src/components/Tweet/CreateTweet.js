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
    media: '',
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
    const formData = new FormData();

    const tweet = {
      media: this.state.media || null,
      tweet: this.state.tweetID,
      text: this.state.text,
      user: this.props.userID,
    };

    for (let key in tweet) {
      console.log('key', key, tweet[key]);
      formData.append(key, tweet[key]);
    }

    this.props.onCreateNewTweet(formData);
    this.setState({ text: '', newTweet: tweet });
    this.props.history.goBack();
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
    const { tweet, newTweet, media } = this.state;

    const form = (
      <form className={classes.form} onSubmit={this.handleSubmit}>
        <input
          type="textarea"
          value={this.state.text}
          onChange={(event) => this.changeHandler(event)}
          placeholder="What's happening ?"
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
                role="button"
                onClick={() => document.getElementById('picture_input').click()}
              >
                <FaImage size="2rem" />
              </div>
              <input
                className={classes.picture__input}
                type="file"
                id="picture_input"
                name="picture_input"
                onChange={(event) => this.onImageChange(event)}
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
