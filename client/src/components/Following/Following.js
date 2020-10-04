import React from 'react';
import { connect } from 'react-redux';

import Badge from '../UI/Badge/Badge';
import classes from './Following.module.css';

const Following = ({ users, me }) => {
  let following = null;
  if (!users[0] || !me.following) {
    return null;
  }

  const getFollowing = () => {
    if (users && me.following) {
      const follows = me.following.map((follow) => follow.followed);
      console.log('follows :>> ', follows);
      const following = users.filter(
        (user) => !follows.includes(user._id) && me._id !== user._id
      );
      console.log('following :>> ', following);
      return following.length > 3 ? following.slice(0, 3) : following;
    }
    return [];
  };

  const follows = getFollowing();

  if (follows[0]) {
    following = follows.map((follow) => (
      <Badge key={follow._id} user={follow || {}} me={me || {}} />
    ));
  } else {
    following = <div>Nobody to follow</div>;
  }

  return (
    <div className={classes.main}>
      <div className={classes.wrapper}>
        <h3 className={classes.header}>Who to follow</h3>
        {following}
      </div>
    </div>
  );
};

const mapStateToProps = ({ user, tweet, auth }) => {
  return {
    users: user.users,
    me: user.user,
    loggedIn: !!auth.token,
    userID: auth.userID,
  };
};

export default connect(mapStateToProps)(Following);
