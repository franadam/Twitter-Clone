import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import dateFormat from 'dateformat';
import { FaCalendarAlt, FaUser, FaMapMarkerAlt, FaLink } from 'react-icons/all';

import TweetsList from '../Tweet/TweetsList';
import Spinner from '../Spinner/Spinner';

import classes from './Profile.module.css';
import Avatar from '../UI/Avatar/Avatar';
import Cover from '../UI/Cover/Cover';

class Profile extends React.Component {
  componentDidMount = () => {
    const { username } = this.props.match.params;
    const user = this.props.users.find(
      (user) => user._id === username || user.username === username
    );
    this.setState({ user });
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
    const { match, tweets: all, users, userID } = this.props;
    const { username } = match.params;
    const user = users.find(
      (user) => user._id === username || user.username === username
    );

    if (!user || !user.createdAt) {
      return <Spinner />;
    }

    const { likes: tweetLiked } = user;
    const tweetsAndReplies = all.filter((tweet) => tweet.user === user._id);

    const tweets = tweetsAndReplies.filter((tweet) => tweet.tweet === null);

    const medias = tweets.filter((tweet) => tweet.media);

    const likes = tweetLiked.map((like) => all.find((l) => like._id === l._id));

    const logo = user.avatar ? (
      <div className={classes.avatar} href={`/${user.username}/avatar`}>
        <img src={`/api/users/${user.username}/avatar`} alt="logo" />
      </div>
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
            <Cover cover={user.cover} userID={user._id} />
            <Avatar
              avatar={user.avatar}
              userID={user._id}
              position="absolute"
            />
          </div>
          <div className={classes.btns}>
            {user._id === userID ? (
              <Link className={classes.edit} to={`/users/${userID}/edit`}>
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
                  <FaLink /> {user.website}
                </p>
              ) : null}
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
            message={`${user.fullname} has not liked anything yet`}
          />
        </div>
        <div
          className={classes.tab__content}
          style={{ display: 'block' }}
          id="medias"
        >
          <TweetsList
            key="medias"
            tweets={medias || []}
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

const mapStateToProps = ({ user, tweet, auth }) => {
  return {
    tweets: tweet.tweets,
    users: user.users,
    loggedIn: !!auth.token,
    userID: auth.userID,
  };
};

export default connect(mapStateToProps)(withRouter(Profile));
