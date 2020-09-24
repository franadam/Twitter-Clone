import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import dateFormat from 'dateformat';
import { FaCalendarAlt, FaUser } from 'react-icons/all';
import axios from 'axios';

import {
  fetchUserTweets,
  fetchCurrentUser,
  fetchUserByName,
} from '../../store/actions';

import TweetsList from '../Tweet/TweetsList';
import Spinner from '../Spinner/Spinner';

import classes from './Profile.module.css';

class Profile extends React.Component {
  state = {
    likes: [],
  };

  componentDidMount = () => {
    const { username } = this.props.match.params;
    //this.props.onFetchUserTweets(username);
    this.props.onFetchUserByName(username);
    //this.props.onFetchCurrentUser();
    console.log('this.props :>> ', this.props);
    //this.fetchLikes();
  };

  //fetchLikes = async () => {
  //  const res = await axios.get(`/api/users/$//{this.props.userID}/likes`);
  //  const likes = res.data;
  //  this.setState({ likes });
  //};

  showTab = (event, tab) => {
    const tabs = document.getElementsByClassName(`${classes.tab__header}`);
    const contents = document.getElementsByClassName(`${classes.tab__content}`);

    if (!this.props.loggedIn) {
      this.props.history.push('/login');
    }

    let i;
    for (i = 0; i < tabs.length; i++) {
      tabs[i].classList.remove(`${classes.tab__header__active}`);
    }
    for (i = 0; i < contents.length; i++) {
      contents[i].style.display = 'none';
    }
    event.target.classList.add(`${classes.tab__header__active}`);
    contents[tab].style.display = 'block';
  };

  render() {
    const { user } = this.props;
    //    const { likes } = this.state;

    if (!user.createdAt) {
      return <Spinner />;
    }

    const tweets = this.props.user.tweets; //.filter((tw) => tw.user === user._id);
    const likes = this.props.user.likes; //.map((l) => l.tweets);
    console.log('tweets :>> ', tweets);
    console.log('likes :>> ', likes);

    const logo = user.avatar ? (
      <a className={classes.avatar} href={`/api/users/${user.username}/avatar`}>
        <img src={`/api/users/${user.username}/avatar`} alt="logo" />
      </a>
    ) : (
      <FaUser className={classes.avatar} size="5rem" />
    );
    const cover = user.cover ? (
      <a href={`/api/users/${user.username}/cover`}>
        <img
          className={classes.cover}
          src={`/api/users/${user.username}/cover`}
          alt="cover"
        />
      </a>
    ) : (
      <div className={classes.cover}></div>
    );

    const joinedAt = new Date(user.createdAt);
    return (
      <div>
        <div className={classes.header}>
          <div className={classes.images}>
            {cover}
            {logo}
          </div>
          <div className={classes.info}>
            <h1>{user.fullname}</h1>
            <h3>{user.username}</h3>
            <h4>
              <FaCalendarAlt /> Joined {dateFormat(joinedAt, 'mmmm yyyy')}
            </h4>
          </div>
        </div>
        <div className={classes.tabs}>
          <h2
            className={`${classes.tab__header} ${classes.tab__header__active}`}
            onClick={(event) => this.showTab(event, 0)}
          >
            Tweets
          </h2>
          <h2
            className={classes.tab__header}
            onClick={(event) => this.showTab(event, 1)}
          >
            Likes
          </h2>
        </div>
        <div
          className={classes.tab__content}
          style={{ display: 'block' }}
          id="tweets"
        >
          <TweetsList
            key="tweet"
            tweets={tweets || []}
            message={`${user.fullname} has not tweeted yet`}
          />
        </div>
        <div className={classes.tab__content} id="likes">
          <TweetsList
            key="like"
            tweets={likes || []}
            message={`${user.fullname} has not liked anything yet`}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ user, tweet }) => {
  console.log('state :>> ', { user, tweet });
  return {
    tweets: tweet.all,
    user: user.user,
    loggedIn: user.isAuthenticated,
    userID: user.userID,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchUserTweets: (id) => dispatch(fetchUserTweets(id)),
    onFetchUserByName: (username) => dispatch(fetchUserByName(username)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Profile));
