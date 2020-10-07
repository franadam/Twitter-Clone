import React from 'react';

import classes from './Spinner.module.css';

function spinner() {
  return <div className={classes.Loader}>Loading...</div>;
}

export default spinner;
