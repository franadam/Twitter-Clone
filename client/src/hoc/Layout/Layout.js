import React from 'react';
import { connect } from 'react-redux';
import Navbar from '../../components/Navbar/Navbar';

import classes from './Layout.module.css';

const Layout = ({ loggedIn, children }) => {
  return (
    <div className={`${classes.main} ${!loggedIn ? classes.unsigned : ''}`}>
      <Navbar />
      <div className={classes.children}>{children}</div>
    </div>
  );
};

const mapStateToProps = ({ auth }) => ({
  loggedIn: !!auth.token,
});

export default connect(mapStateToProps)(Layout);
