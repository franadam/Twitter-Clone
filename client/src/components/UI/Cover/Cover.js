import React from 'react';
import classes from './Cover.module.css';

const Cover = ({ cover, userID, myID }) => {
  return cover ? (
    <div className={classes.cover}>
      <img
        className={classes.cover}
        src={`/api/users/${userID}/cover`}
        alt="cover"
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
};

export default Cover;
