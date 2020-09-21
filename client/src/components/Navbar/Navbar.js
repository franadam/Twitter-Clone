import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  FaTwitter,
  FaRegUser,
  FaFeatherAlt,
  FaDoorOpen,
} from 'react-icons/all';

import { logout } from '../../store/actions';

import classes from './Navbar.module.css';

class NavBar extends React.Component {
  logoutUser = (event) => {
    event.preventDefault();
    this.props.logout();
  };

  // Selectively render links dependent on whether the user is logged in
  getLinks = () => {
    if (this.props.loggedIn) {
      return (
        <div className={classes.links}>
          <Link className={classes.link1} to={'/home'}>
            <FaTwitter size="2rem" />
          </Link>
          <Link className={classes.link1} to={`/users/${this.props.userID}`}>
            <FaRegUser size="2rem" />
          </Link>
          <Link className={classes.link1} to={'/compose/tweet'}>
            <FaFeatherAlt size="2rem" />
          </Link>
          <FaDoorOpen size="2rem" color="red" onClick={this.logoutUser} />
        </div>
      );
    } else {
      return (
        <div className={classes.links}>
          <Link className={classes.signup} to={'/signup'}>
            Signup
          </Link>
          <Link className={classes.signin} to={'/login'}>
            Login
          </Link>
        </div>
      );
    }
  };

  render() {
    return <div className={classes.main}>{this.getLinks()}</div>;
  }
}

const mapStateToProps = ({ user }) => ({
  userID: user.userID,
  loggedIn: user.isAuthenticated,
});

export default connect(mapStateToProps, { logout })(NavBar);
