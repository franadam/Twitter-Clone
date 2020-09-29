import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import dateFormat from 'dateformat';
import { FaCalendarAlt, FaUser, FaMapMarkerAlt, FaLink } from 'react-icons/all';
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
  componentDidMount = () => {
    const { username } = this.props.match.params;
    this.props.onFetchUserByName(username);
  };

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

    if (!user.createdAt) {
      return <Spinner />;
    }

    const tweets = this.props.user.tweets;
    const likes = this.props.user.likes;

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
            <h1 className={classes.info__fullname}>{user.fullname}</h1>
            <p className={classes.info__username}>@{user.username}</p>
            <p className={classes.info__bio}>{'user.bio'}</p>
            <div className={classes.place}>
              <p>
                <FaMapMarkerAlt /> {'user.place'}
              </p>
              <p>
                <FaLink /> {'user.website'}
              </p>
              <p>
                <FaCalendarAlt /> Joined {dateFormat(joinedAt, 'mmmm yyyy')}
              </p>
            </div>
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
