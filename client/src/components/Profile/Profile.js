import React from 'react';
import { connect } from 'react-redux';
import dateFormat from 'dateformat';
import { FaCalendarAlt, FaUser, GiClawSlashes } from 'react-icons/all';
import TweetBox from '../Tweet/TweetBox';
import {
  fetchUserTweets,
  fetchCurrentUser,
  fetchUserByName,
} from '../../store/actions';

import classes from './Profile.module.css';
import { Link } from 'react-router-dom';
import TweetsList from '../Tweet/TweetsList';

class Profile extends React.Component {
  state = {
    tweets: [],
  };

  componentDidMount = () => {
    const { username } = this.props.match.params;
    //this.props.onFetchUserTweets(username);
    this.props.onFetchUserByName(username);
    //this.props.onFetchCurrentUser();
    const tweets = this.props.tweets.filter((tw) => tw.user === username);
  };

  getTweet = (tweets) => {
    if (tweets.length === 0) {
      return <div>This user has no Tweets</div>;
    } else {
      return (
        <div className={classes.tweets}>
          {tweets.map((tweet) => (
            <TweetBox
              key={tweet._id}
              id={tweet._id}
              text={tweet.text}
              userID={tweet.user}
              date={tweet.updatedAt || ''}
            />
          ))}
        </div>
      );
    }
  };

  render() {
    const { user } = this.props;
    if (!user.createdAt) {
      return null;
    }

    const tweets = this.props.tweets.filter((tw) => tw.user === user._id);

    const logo = user.avatar ? (
      <a className={classes.avatar} href={`/api/users/${user.username}/avatar`}>
        <img src={`/api/users/${user.username}/avatar`} alt="logo" />
      </a>
    ) : (
      <FaUser className={classes.avatar} size="5rem" />
    );
    const cover = user.cover ? (
      <a href={`/api/users/${user.username}/cover`}>
        <img
          className={classes.cover}
          src={`/api/users/${user.username}/cover`}
          alt="cover"
        />
      </a>
    ) : (
      <div className={classes.cover}></div>
    );

    const joinedAt = new Date(user.createdAt);
    return (
      <div>
        <div className={classes.header}>
          <div className={classes.images}>
            {cover}
            {logo}
          </div>
          <div className={classes.info}>
            <h1>{user.fullname}</h1>
            <h3>{user.username}</h3>
            <h4>
              <FaCalendarAlt /> Joined {dateFormat(joinedAt, 'mmmm yyyy')}
            </h4>
          </div>
        </div>
        <div className={classes.tabs}>
          <h2>Tweets</h2>
          <h2>Likes</h2>
        </div>
        <TweetsList
          tweets={tweets}
          message={`${user.fullname} has not tweeted yet`}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  console.log('state :>> ', state);
  return {
    tweets: state.tweet.all,
    user: state.user.user,
    userID: state.user.userID,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchUserTweets: (id) => dispatch(fetchUserTweets(id)),
    onFetchCurrentUser: () => dispatch(fetchCurrentUser()),
    onFetchUserByName: (username) => dispatch(fetchUserByName(username)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);