import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import dateFormat from 'dateformat';
import { FaCalendarAlt, FaMapMarkerAlt, FaLink } from 'react-icons/all';

import TweetsList from '../Tweet/TweetsList';
import Spinner from '../UI/Spinner/Spinner';

import Avatar from '../UI/Avatar/Avatar';
import Cover from '../UI/Cover/Cover';

import classes from './Profile.module.css';

import {
  unfollowUser,
  followUser,
  fetchCurrentUser,
} from '../../store/actions';

class Profile extends Component {
  state = {
    isFollowed: false,
    user: {},
  };

  componentDidMount = () => {
    console.log('this.props', this.props);
    const isFollowed = this.checkFollowing();
    this.setState({ isFollowed });
  };

  componentWillUnmount = () => {
    this.setState({ isFollowed: false });
  };

  checkFollowing = () => {
    const { me, userID } = this.props;
    const isFollowed = me.following
      ? !!me.following.find((follow) => follow.follower === userID)
      : null;
    return isFollowed;
  };

  followHander = () => {
    const { isFollowed, user } = this.state;
    if (!this.props.loggedIn) {
      this.props.history.push('/login');
    } else {
      if (isFollowed) {
        this.props.onUnfollowUser(user._id);
        this.setState({ isFollowed: false });
      } else {
        this.props.onFollowUser(user._id);
        this.setState({ isFollowed: true });
      }
    }
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
    const { tweets: all, userID, match } = this.props;
    const { username } = match.params;
    const user = this.props.users.find(
      (user) => user._id === username || user.username === username
    );

    console.log('user :>> ', user);
    if (!user || !user.createdAt) {
      return <Spinner />;
    }

    //

    const { likes: tweetLiked } = user;
    const tweetsAndReplies = all.filter((tweet) => tweet.user === user._id);

    const tweets = tweetsAndReplies.filter((tweet) => tweet.tweet === null);

    const medias = tweets.filter((tweet) => tweet.media);

    const likes = tweetLiked.map((like) => all.find((l) => like._id === l._id));

    const joinedAt = new Date(user.createdAt);
    return (
      <div>
        <div className={classes.header}>
          <div className={classes.images}>
            <Cover cover={user.cover} userID={user._id} myID={userID} />
            <Avatar
              avatar={user.avatar}
              userID={user._id}
              position="absolute"
            />
          </div>
          <div className={classes.btns}>
            {user._id !== userID ? (
              <button
                className={classes.btn}
                onClick={() => this.followHander()}
              >
                {this.state.isFollowed ? 'Unfollow' : 'Follow'}
              </button>
            ) : null}
            {user._id === userID ? (
              <Link className={classes.btn} to={`/users/${userID}/edit`}>
                Edit Profile
              </Link>
            ) : null}
          </div>
          <div className={classes.info}>
            <h1 className={classes.info__fullname}>{user.fullname}</h1>
            <p className={classes.info__username}>@{user.username}</p>
            {user.bio ? <p className={classes.info__bio}>{user.bio}</p> : null}
            <div className={classes.place}>
              {user.location ? (
                <p>
                  <FaMapMarkerAlt /> {user.location}
                </p>
              ) : null}
              {user.website ? (
                <p>
                  <FaLink />{' '}
                  <a href={user.website} target="_blank">
                    {user.website}
                  </a>
                </p>
              ) : null}
              <p>
                <FaCalendarAlt /> Joined {dateFormat(joinedAt, 'mmmm yyyy')}
              </p>
            </div>
            <div className={classes.follows}>
              <Link to={`/users/${userID}/follow`}>
                <div className={classes.count}>{user.following.length}</div>
                following
              </Link>
              <Link to={`/users/${userID}/follow`}>
                <div className={classes.count}>{user.followers.length}</div>
                followers
              </Link>
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
            Tweets & Replies
          </h2>
          <h2
            className={classes.tab__header}
            onClick={(event) => this.showTab(event, 2)}
          >
            Medias
          </h2>
          <h2
            className={classes.tab__header}
            onClick={(event) => this.showTab(event, 3)}
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
        <div className={classes.tab__content} id="tweets_and_replies">
          <TweetsList
            key="tweets_and_replies"
            tweets={tweetsAndReplies || []}
            message={`${user.fullname} has not tweeted or commented yet`}
          />
        </div>
        <div className={classes.tab__content} id="medias">
          <TweetsList
            key="medias"
            tweets={medias || []}
            message={`${user.fullname} has not tweeted any medias yet`}
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

const mapStateToProps = ({ user, tweet, auth }) => {
  return {
    tweets: tweet.tweets,
    users: user.users,
    me: user.user,
    loggedIn: !!auth.token,
    userID: auth.userID,
  };
};

const mapDispatchToProps = (dispatch) => ({
  onFollowUser: (userID) => dispatch(followUser(userID)),
  onUnfollowUser: (userID) => dispatch(unfollowUser(userID)),
  onFetchCurrentUser: (userID) => dispatch(fetchCurrentUser(userID)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Profile));
