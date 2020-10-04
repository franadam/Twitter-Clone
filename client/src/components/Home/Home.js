import React, { Component } from 'react';
import { connect } from 'react-redux';

import { fetchCurrentUser } from '../../store/actions';
import CreateTweet from '../Tweet/CreateTweet';

import classes from './Home.module.css';
import TweetsList from '../Tweet/TweetsList';

class Home extends Component {
  componentDidMount() {
    this.props.onFetchCurrentUser(this.props.userID);
  }

  getTweets = () => {
    const { tweets, me, userID } = this.props;
    if (tweets && me.following) {
      const follows = me.following.map((follow) => follow.followed);
      const newTweets = tweets.filter(
        (tweet) => follows.includes(tweet.user) || tweet.user === userID
      );
      return newTweets;
    }
    return [];
  };

  render() {
    const { tweets } = this.props;
    if (!tweets) return null;

    return (
      <div className={classes.main}>
        <h1 className={classes.header}>Home</h1>
        <div className={classes.compose}>
          <CreateTweet />
        </div>
        <TweetsList
          tweets={this.getTweets()}
          message={'Nobody has Tweeted yet !'}
        />
      </div>
    );
  }
}

const mapStateToProps = ({ tweet, auth, user }) => {
  return {
    tweets: tweet.tweets,
    userID: auth.userID,
    me: user.user,
  };
};

const mapDispatchToProps = (dispatch) => ({
  onFetchCurrentUser: (userID) => dispatch(fetchCurrentUser(userID)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
