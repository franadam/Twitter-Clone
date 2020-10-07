import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import Avatar from '../Avatar/Avatar';
import { followUser, unfollowUser } from '../../../store/actions';

import classes from './Badge.module.css';

function Badge({ history, user, me, onUnfollowUser, onFollowUser }) {
  const checkFollowing = () => {
      const isFollowed = me.following
        ? Boolean(me.following.find((follow) => follow.followed === user._id))
        : null;
      return isFollowed;
    },
    isFollowed = checkFollowing(),
    followHander = (isFollowed, userID) => {
      if (isFollowed) {
        onUnfollowUser(userID);
      } else {
        onFollowUser(userID);
      }
    },
    click = (event) => {
      event.stopPropagation();
      console.log('event.currentTarget :>> ', event.currentTarget);
      followHander(isFollowed, user._id);
    };
  return (
    <div
      className={classes.main}
      onClick={() => history.push(`/users/${user.username}`)}
    >
      <Link className={classes.logo} to={`/users/${user.username}`}>
        <Avatar avatar={user.avatar} size="3rem" userID={user._id} />
      </Link>
      <div className={classes.info}>
        <h3 className={classes.info__fullname}>{user.fullname}</h3>
        <p className={classes.info__username}>@{user.username}</p>
        {user.bio ? <p className={classes.info__bio}>{user.bio}</p> : null}
      </div>
      <button className={classes.btn} onClick={(event) => click(event)}>
        {isFollowed ? 'Unfollow' : 'Follow'}
      </button>
    </div>
  );
}

const mapDispatchToProps = (dispatch) => ({
  onFollowUser: (userID) => dispatch(followUser(userID)),
  onUnfollowUser: (userID) => dispatch(unfollowUser(userID)),
});

Badge.propTypes = {
  userID: PropTypes.string,
  user: PropTypes.object,
  me: PropTypes.object,
  history: PropTypes.object,
  onFollowUser: PropTypes.func,
  onUnfollowUser: PropTypes.func,
};

export default connect(null, mapDispatchToProps)(withRouter(Badge));
