import React from 'react';
import { FaUser } from 'react-icons/fa';
import classes from './Avatar.module.css';

const Avatar = ({ avatar, userID, size, position }) => {
  let style = {};
  if (size) {
    style.height = size;
    style.width = size;
  }
  if (position) style.position = position;
  return avatar ? (
    <div className={classes.avatar} style={style}>
      <img
        src={`/api/users/${userID}/avatar`}
        alt="logo"
        onClick={(event) => event.stopPropagation()}
      />
    </div>
  ) : (
    <div
      className={classes.avatar}
      style={{ ...style, backgroundColor: '#15202b' }}
    >
      <FaUser size={!size ? '6rem' : size} />
    </div>
  );
};

export default Avatar;
