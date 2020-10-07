import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

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
      const follows = me.following.map((follow) => follow.followed),
        newTweets = tweets.filter(
          (tweet) => follows.includes(tweet.user) || tweet.user === userID
        );
      return newTweets;
    }
    return [];
  };

  render() {
    const { tweets } = this.props;

    return (
      <div className={classes.main}>
        <h1 className={classes.header}>Home</h1>
        <div className={classes.compose}>
          <CreateTweet />
        </div>
        {!tweets ? null : (
          <TweetsList
            message="Nobody has Tweeted yet !"
            tweets={this.getTweets()}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = ({ tweet, auth, user }) => ({
    tweets: tweet.tweets,
    userID: auth.userID,
    me: user.user,
  }),
  mapDispatchToProps = (dispatch) => ({
    onFetchCurrentUser: (userID) => dispatch(fetchCurrentUser(userID)),
  });

Home.propTypes = {
  me: PropTypes.object,
  history: PropTypes.object,
  match: PropTypes.object,
  userID: PropTypes.string,
  onFetchCurrentUser: PropTypes.func,
  tweets: PropTypes.arrayOf(PropTypes.object),
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
