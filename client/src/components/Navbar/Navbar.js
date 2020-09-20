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
          <Link className={classes.link1} to={`/users/${this.props.userID}`}>
            Profile
          </Link>
          <Link className={classes.link1} to={'/compose/tweet'}>
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
        <Link to="/home">Twitter</Link>
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
