import React from 'react';
import Navbar from '../../components/Navbar/Navbar';

import classes from './Layout.module.css';

const Layout = (props) => {
  return (
    <div className={classes.main}>
      <Navbar />
      <div className={classes.children}>{props.children}</div>
    </div>
  );
};

export default Layout;
