import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

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
          <Link className={classes.link1} to={'/tweets'}>
            All Tweets
          </Link>
          <Link className={classes.link1} to={'/profile'}>
            Profile
          </Link>
          <Link className={classes.link1} to={'/new_tweet'}>
            Write a Tweet
          </Link>
          <button onClick={this.logoutUser}>Logout</button>
        </div>
      );
    } else {
      return (
        <div className={classes.links}>
          <Link className={classes.link2} to={'/signup'}>
            Signup
          </Link>
          <Link className={classes.link2} to={'/login'}>
            Login
          </Link>
        </div>
      );
    }
  };

  render() {
    return (
      <div className={classes.main}>
        <a
          href="https://innoloft.com/public/en/"
          rel="noopener noreferrer"
          target="_blank"
        >
          Twitter
        </a>
        {this.getLinks()}
      </div>
    );
  }
}

const mapStateToProps = ({ user }) => ({
  loggedIn: user.isAuthenticated,
});

export default connect(mapStateToProps, { logout })(NavBar);
