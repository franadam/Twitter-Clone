import React from 'react';
import PropTypes from 'prop-types';

import classes from './Cover.module.css';

function Cover({ cover, userID, myID }) {
  return cover ? (
    <div className={classes.cover}>
      <img
        alt="cover"
        className={classes.cover}
        src={`/api/users/${userID}/cover`}
      />
    </div>
  ) : (
    <div className={classes.cover}>
      {userID === myID ? (
        <>
          <p>Update your profile</p>
          <p>Add a cover</p>
        </>
      ) : null}
    </div>
  );
}

Cover.propTypes = {
  cover: PropTypes.string,
  userID: PropTypes.string,
  myID: PropTypes.string,
};

export default Cover;
