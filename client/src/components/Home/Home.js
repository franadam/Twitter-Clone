import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import TweetBox from '../Tweet/TweetBox';

import { fetchTweets, fetchCurrentUser } from '../../store/actions';
import CreateTweet from '../Tweet/CreateTweet';
import { FaUser } from 'react-icons/all';

import classes from './Home.module.css';
import TweetsList from '../Tweet/TweetsList';
class Tweet extends React.Component {
  state = {
    tweets: [],
  };

  componentDidMount() {
    //this.props.fetchTweets();
    //    this.props.fetchCurrentUser();
  }

  render() {
    const { user, userID, tweets } = this.props;
    if (!user || !tweets) return null;
    const logo = user.avatar ? (
      <img
        className={classes.avatar}
        src={`/api/users/${userID}/avatar`}
        alt="logo"
      />
    ) : (
      <FaUser size="3rem" />
    );

    return (
      <div className={classes.main}>
        <h1 className={classes.header}>Home</h1>
        <div className={classes.compose}>
          <CreateTweet />
        </div>
        <TweetsList tweets={tweets} message={'Nobody has Tweeted yet !'} />
      </div>
    );
  }
}

const mapStateToProps = ({ tweet, user }) => {
  return {
    tweets: tweet.all,
    user: user.user,
    userID: user.userID,
  };
};

export default connect(mapStateToProps, { fetchTweets, fetchCurrentUser })(
  Tweet
);
