import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import TweetBox from './TweetBox';
import axios from 'axios';

import { fetchTweets } from '../../store/actions';
import TweetsList from './TweetsList';
import classes from './Tweet.module.css';

class Tweet extends React.Component {
  render() {
    const { tweetID } = this.props.match.params;

    const tweet = this.props.tweets.find((tw) => tw._id === tweetID);

    if (!tweet) return null;

    const tweets = this.props.tweets.filter((tw) => tw.tweet === tweet._id);

    return (
      <div className={classes.main}>
        <div className={classes.wrapper}>
          <div className={classes.mainTweet}>
            {tweet ? (
              <TweetBox
                id={tweet._id}
                userID={tweet.user}
                text={tweet.text}
                media={tweet.media}
                date={tweet.updatedAt || ''}
                likes={tweet.likes || []}
                comments={tweet.comments || []}
              />
            ) : null}
          </div>
          <div className={classes.comments}>
            <TweetsList tweets={tweets} message={'Be the first to comment'} />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ tweet }) => {
  return {
    tweets: tweet.tweets,
  };
};

export default connect(mapStateToProps, { fetchTweets })(Tweet);
