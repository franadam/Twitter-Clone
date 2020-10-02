import React from 'react';
import classes from './Cover.module.css';

const Cover = ({ cover, userID }) => {
  return cover ? (
    <div className={classes.cover}>
      <img
        className={classes.cover}
        src={`/api/users/${userID}/cover`}
        alt="cover"
      />
    </div>
  ) : (
    <div className={classes.cover}></div>
  );
};

export default Cover;
