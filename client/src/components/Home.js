import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import TweetBox from './Tweet/TweetBox';

import { fetchTweets, fetchCurrentUser } from '../store/actions';
import CreateTweet from './Tweet/CreateTweet';
import { FaUser } from 'react-icons/all';

import classes from './Home.module.css';
import TweetsList from './Tweet/TweetsList';
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
    if (!user) return null;
    const logo = user.avatar ? (
      <img
        className={classes.avatar}
        src={`/api/users/${this.props.userID}/avatar`}
        alt="logo"
      />
    ) : (
      <FaUser size="2rem" />
    );

    return (
      <div>
        <h1 className={classes.header}>A Twitter Clone</h1>
        <div className={classes.createTweet}>
          <Link to={`/users/${user.username || userID}`}>{logo}</Link>
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
