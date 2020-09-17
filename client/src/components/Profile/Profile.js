import React from 'react';
import { connect } from 'react-redux';
import TweetBox from '../Tweet/TweetBox';
import { fetchUserTweets, fetchCurrentUser } from '../../store/actions';

class Profile extends React.Component {
  state = {
    tweets: [],
  };

  componentDidMount() {
    console.log('profile cpm', this.props);
    this.props.onFetchUserTweets(this.props.userID);
    this.props.onFetchCurrentUser();
  }

  render() {
    if (this.props.tweets.length === 0) {
      return <div>This user has no Tweets</div>;
    } else {
      return (
        <div>
          <h2>All of This User's Tweets</h2>
          {this.props.tweets.map((tweet) => (
            <TweetBox
              key={tweet._id}
              text={tweet.text}
              user={this.props.user}
            />
          ))}
        </div>
      );
    }
  }
}

const mapStateToProps = (state) => {
  return {
    tweets: state.tweet.user,
    userID: state.user.userID,
    user: state.user.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchUserTweets: (id) => dispatch(fetchUserTweets(id)),
    onFetchCurrentUser: () => dispatch(fetchCurrentUser()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
