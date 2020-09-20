import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import TweetBox from './TweetBox';

import { fetchTweets } from '../../store/actions';

class Tweet extends React.Component {
  state = {
    tweets: [],
  };

  componentWillMount() {
    this.props.fetchTweets();
  }

  componentWillReceiveProps(newState) {
    this.setState({ tweets: newState.tweets });
  }

  render() {
    if (this.state.tweets.length === 0) {
      return <div>There are no Tweets</div>;
    } else {
      return (
        <div>
          <h2>All Tweets</h2>
          {this.state.tweets.map((tweet) => (
            <TweetBox
              key={tweet._id}
              id={tweet._id}
              text={tweet.text}
              date={tweet.updatedAt || ''}
            />
          ))}
        </div>
      );
    }
  }
}

const mapStateToProps = ({ tweet }) => {
  return {
    tweets: tweet.all,
  };
};

export default connect(mapStateToProps, { fetchTweets })(Tweet);
