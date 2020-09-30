import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import TweetBox from './TweetBox';
import axios from 'axios';

import { fetchTweets } from '../../store/actions';
import TweetsList from './TweetsList';
import classes from './Tweet.module.css';

class Tweet extends React.Component {
  state = {
    tweets: [],
  };

  componentDidMount() {
    console.log('this.props :>> ', this.props);
    console.log('this.state :>> ', this.state);
    const { tweetID } = this.props.match.params;
    if (tweetID) {
      this.setState({ tweetID });
      this.getTweet(tweetID);
    }
  }

  getTweet = async (tweetID) => {
    try {
      const res = await axios.get(`/api/tweets/${tweetID}`);
      console.log('res :>> ', res);
      const tweet = res.data;
      this.setState({ tweet });
    } catch (error) {
      console.log('error :>> ', error);
    }
  };

  render() {
    const { tweet } = this.state;
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
    tweets: tweet.all,
  };
};

export default connect(mapStateToProps, { fetchTweets })(Tweet);
