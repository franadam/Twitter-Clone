import React from 'react';
import { FaUser } from 'react-icons/fa';
import classes from './Avatar.module.css';

const Avatar = ({ avatar, userID, size }) => {
  return avatar ? (
    <div className={classes.avatar} style={{ height: size }}>
      <img
        src={`/api/users/${userID}/avatar`}
        alt="logo"
        onClick={(event) => event.stopPropagation()}
      />
    </div>
  ) : (
    <FaUser color="#f0f8ff" size="2rem" />
  );
};

export default Avatar;
