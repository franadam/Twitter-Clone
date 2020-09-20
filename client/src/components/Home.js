import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import TweetBox from './Tweet/TweetBox';

import { fetchTweets, fetchCurrentUser } from '../store/actions';
import CreateTweet from './Tweet/CreateTweet';
import { FaUser } from 'react-icons/all';

import classes from './Home.module.css';
class Tweet extends React.Component {
  state = {
    tweets: [],
  };

  componentDidMount() {
    this.props.fetchTweets();
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
    if (tweets.length === 0) {
      return <div>There are no Tweets</div>;
    } else {
      return (
        <div>
          <h1>A Twitter Clone</h1>
          <div className={classes.createTweet}>
            <Link to={`/users/${user.username || this.props.userID}`}>
              {logo}
            </Link>
            <CreateTweet />
          </div>
          <h2>All Tweets</h2>
          {tweets.map((tweet) => (
            <TweetBox
              key={tweet._id}
              id={tweet._id}
              userID={tweet.user}
              text={tweet.text}
              date={tweet.updatedAt || ''}
            />
          ))}
        </div>
      );
    }
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
