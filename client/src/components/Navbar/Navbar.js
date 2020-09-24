import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  FaTwitter,
  FaRegUser,
  FaFeatherAlt,
  FaDoorOpen,
  FaBars,
} from 'react-icons/all';

import { logout } from '../../store/actions';

import classes from './Navbar.module.css';

class NavBar extends React.Component {
  logoutUser = (event) => {
    event.preventDefault();
    this.props.logout();
  };

  activateLink = (event) => {
    const links = document.getElementsByTagName(`svg`);
    let i;
    for (i = 0; i < links.length; i++) {
      links[i].classList.remove(`${classes.active}`);
    }
    event.currentTarget.classList.add(`${classes.active}`);
  };

  getLinks = () => {
    if (this.props.loggedIn) {
      return (
        <div className={classes.links}>
          <Link className={`${classes.link}`} to={'/home'}>
            <FaTwitter
              className={classes.active}
              onClick={(event) => this.activateLink(event)}
              size="2rem"
            />
          </Link>
          <Link
            className={classes.link}
            to={{
              key: Math.random(),
              pathname: `/users/${this.props.userID}`,
              state: { fromDashboard: true },
            }}
          >
            <FaRegUser
              size="2rem"
              onClick={(event) => this.activateLink(event)}
            />
          </Link>
          <Link className={classes.link} to={'/compose/tweet'}>
            <FaFeatherAlt
              size="2rem"
              onClick={(event) => this.activateLink(event)}
            />
          </Link>
          <FaDoorOpen size="2rem" color="red" onClick={this.logoutUser} />
        </div>
      );
    } else {
      return (
        <div className={classes.links}>
          <Link className={`${classes.link} ${classes.signup}`} to={'/signup'}>
            Signup
          </Link>
          <Link className={`${classes.link} ${classes.signin}`} to={'/login'}>
            Login
          </Link>
        </div>
      );
    }
  };

  render() {
    return (
      <div id="sidebar" className={classes.main}>
        {this.getLinks()}
      </div>
    );
  }
}

const mapStateToProps = ({ user }) => ({
  userID: user.userID,
  loggedIn: user.isAuthenticated,
});

export default connect(mapStateToProps, { logout })(NavBar);
