import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Following from '../../components/Following/Following';
import Navbar from '../../components/Navbar/Navbar';

import { fetchCurrentUser } from '../../store/actions';

import classes from './Layout.module.css';

function Layout({ loggedIn, children, onFetchCurrentUser, userID }) {
  onFetchCurrentUser(userID);
  return (
    <div className={`${classes.main} ${!loggedIn ? classes.unsigned : ''}`}>
      <Navbar />
      <div className={classes.children}>{children}</div>
      <div className={classes.following}>
        <Following />
      </div>
    </div>
  );
}

const mapStateToProps = ({ auth }) => ({
    userID: auth.userID,
    loggedIn: Boolean(auth.token),
  }),
  mapDispatchToProps = (dispatch) => ({
    onFetchCurrentUser: (userID) => dispatch(fetchCurrentUser(userID)),
  });

Layout.propTypes = {
  userID: PropTypes.string,
  loggedIn: PropTypes.bool,
  children: PropTypes.object,
  onFetchCurrentUser: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
