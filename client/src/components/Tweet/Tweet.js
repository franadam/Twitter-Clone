import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { fetchTweets } from '../../store/actions';
import TweetBox from './TweetBox';
import TweetsList from './TweetsList';

import classes from './Tweet.module.css';

class Tweet extends React.Component {
  render() {
    const { tweetID } = this.props.match.params,
      tweet = this.props.tweets.find((tw) => tw._id === tweetID);

    if (!tweet) {
      return null;
    }

    const tweets = this.props.tweets.filter((tw) => tw.tweet === tweet._id);

    return (
      <div className={classes.main}>
        <div className={classes.wrapper}>
          <div className={classes.mainTweet}>
            {tweet ? (
              <TweetBox
                comments={tweet.comments || []}
                date={tweet.updatedAt || ''}
                id={tweet._id}
                likes={tweet.likes || []}
                media={tweet.media}
                text={tweet.text}
                userID={tweet.user}
              />
            ) : null}
          </div>
          <div className={classes.comments}>
            <TweetsList message="Be the first to comment" tweets={tweets} />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ tweet }) => ({
  tweets: tweet.tweets,
});

Tweet.propTypes = {
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

export default connect(mapStateToProps, { fetchTweets })(Tweet);
