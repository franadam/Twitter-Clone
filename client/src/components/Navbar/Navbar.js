import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  FaDoorOpen,
  FaFeatherAlt,
  FaRegUser,
  FaTwitter,
} from 'react-icons/all';

import { login, logout } from '../../store/actions';

import classes from './Navbar.module.css';

class NavBar extends React.Component {
  logoutUser = (event) => {
    event.preventDefault();
    this.props.onLogout();
  };

  activateLink = (event) => {
    const links = document.getElementsByTagName('svg');
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
          <div>
            <Link className={`${classes.link}`} to="/home">
              <FaTwitter
                className={classes.active}
                onClick={(event) => this.activateLink(event)}
                size="2rem"
              />
            </Link>
          </div>
          <div className={classes.links__profile}>
            <Link
              className={classes.link}
              to={{
                key: Math.random(),
                pathname: `/users/${this.props.userID}`,
                state: { fromDashboard: true },
              }}
            >
              <FaRegUser
                onClick={(event) => this.activateLink(event)}
                size="2rem"
              />
            </Link>
            <Link className={classes.link} to="/compose/tweet">
              <FaFeatherAlt
                onClick={(event) => this.activateLink(event)}
                size="2rem"
              />
            </Link>
          </div>
          <div>
            <FaDoorOpen color="red" onClick={this.logoutUser} size="2rem" />
          </div>
        </div>
      );
    }
    return (
      <div className={classes.wrapper}>
        <div className={`${classes.links} ${classes.navbar}`}>
          <Link className={`${classes.link} ${classes.signup}`} to="/signup">
            Signup
          </Link>
          <Link className={`${classes.link} ${classes.signin}`} to="/login">
            Login
          </Link>
        </div>

        <button
          className={`${classes.link} ${classes.demo}`}
          onClick={() =>
            this.props.onLogin({
              email: 'guest@gmail.com',
              password: 'Guest123.',
            })
          }
          type="submit"
        >
          DEMO LOGIN
        </button>
      </div>
    );
  };

  render() {
    return (
      <div
        className={`${classes.main} ${
          !this.props.loggedIn ? classes.unsigned : ''
        }`}
        id="sidebar"
      >
        {this.getLinks()}
      </div>
    );
  }
}

const mapStateToProps = ({ auth }) => ({
    userID: auth.userID,
    loggedIn: Boolean(auth.token),
  }),
  mapDispatchToProps = (dispatch) => ({
    onLogout: () => dispatch(logout()),
    onLogin: (user) => dispatch(login(user)),
  });

NavBar.propTypes = {
  loggedIn: PropTypes.bool,
  userID: PropTypes.string,
  onLogout: PropTypes.func,
  onLogin: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
