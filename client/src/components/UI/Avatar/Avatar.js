import React from 'react';
import { FaUser } from 'react-icons/fa';
import PropTypes from 'prop-types';

import classes from './Avatar.module.css';

function Avatar({ avatar, userID, size, position }) {
  const style = {};
  if (size) {
    style.height = size;
    style.width = size;
  }
  if (position) {
    style.position = position;
  }
  return avatar ? (
    <div className={classes.avatar} style={style}>
      <img
        alt="logo"
        onClick={(event) => event.stopPropagation()}
        src={`/api/users/${userID}/avatar`}
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
}

Avatar.propTypes = {
  avatar: PropTypes.string,
  userID: PropTypes.string,
  position: PropTypes.string,
  size: PropTypes.string,
};

export default Avatar;
