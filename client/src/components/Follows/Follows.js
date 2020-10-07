import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import Spinner from '../UI/Spinner/Spinner';
import Badge from '../UI/Badge/Badge';

import classes from './Follows.module.css';
import Cover from '../UI/Cover/Cover';
import Avatar from '../UI/Avatar/Avatar';

class Follows extends Component {
  componentDidMount = () => {
    console.log('this.props', this.props);
  };

  showTab = (event, tab) => {
    const tabs = document.getElementsByClassName(`${classes.tab__header}`),
      contents = document.getElementsByClassName(`${classes.tab__content}`);

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

  getFollowers = () => {
    const { users, me } = this.props;
    if (users && me.followers) {
      const follows = me.followers.map((follow) => follow.follower);
      console.log('follows :>> ', follows);
      const followers = users.filter((user) => follows.includes(user._id));
      console.log('followers :>> ', followers);
      return followers;
    }
    return [];
  };

  getFollowing = () => {
    const { users, me } = this.props;
    if (users && me.following) {
      const follows = me.following.map((follow) => follow.followed);
      console.log('follows :>> ', follows);
      const following = users.filter((user) => follows.includes(user._id));
      console.log('following :>> ', following);
      return following;
    }
    return [];
  };

  render() {
    const { userID, users, me } = this.props;

    console.log('user :>> ', users);
    if (!users) {
      return <Spinner />;
    }

    const followers = this.getFollowers(),
      following = this.getFollowing();

    console.log('following :>> ', following);
    console.log('followers :>> ', followers);

    return (
      <div className={classes.header}>
        <div className={classes.header}>
          <div className={classes.images}>
            <Cover cover={me.cover} myID={userID} userID={userID} />{' '}
            <Avatar avatar={me.avatar} position="absolute" userID={userID} />
          </div>
        </div>

        <div className={classes.tabs}>
          <h2
            className={`${classes.tab__header} ${classes.tab__header__active}`}
            onClick={(event) => this.showTab(event, 0)}
          >
            Followers
          </h2>
          <h2
            className={classes.tab__header}
            onClick={(event) => this.showTab(event, 1)}
          >
            Following
          </h2>
        </div>
        <div
          className={classes.tab__content}
          id="followers"
          style={{ display: 'block' }}
        >
          {followers.map((follow) => (
            <Badge
              key={`${follow._id}${(Math.random() * 100).toFixed(0)}`}
              me={this.props.me || {}}
              user={follow}
            />
          ))}
        </div>
        <div className={classes.tab__content} id="following">
          {following.map((follow) => (
            <Badge
              key={`${follow._id}${(Math.random() * 100).toFixed(0)}`}
              me={this.props.me || {}}
              user={follow}
            />
          ))}
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ user, auth }) => ({
  users: user.users,
  me: user.user,
  loggedIn: Boolean(auth.token),
  userID: auth.userID,
});

Follows.propTypes = {
  me: PropTypes.object,
  history: PropTypes.object,
  match: PropTypes.object,
  userID: PropTypes.string,
  loggedIn: PropTypes.bool,
  users: PropTypes.arrayOf(PropTypes.object),
};

export default connect(mapStateToProps)(withRouter(Follows));
