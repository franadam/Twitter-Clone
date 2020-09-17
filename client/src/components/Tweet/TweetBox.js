import React from 'react';
import classes from './TweetBox.module.css';
import { FaRegComment, FaRegHeart } from 'react-icons/all';

const TweetBox = ({ user, text }) => {
  return (
    <div className={classes.main}>
      <div className={classes.logo}></div>
      <div className={classes.wrapper}>
        <div className={classes.name}>
          <a className={classes.username}>
            <div className={classes.naame}>{text}</div>
          </a>
          <time className={classes.date}>
            {`user.birth_date dateTime={'user.birth_date'}`}
          </time>
        </div>
        <div className={classes.text}>{text}</div>
        <div className={classes.image}></div>
        <div className={classes.activity}>
          <div className={classes.comment}>
            <FaRegComment />
            22
          </div>
          <div className={classes.like}>
            <FaRegHeart />
            12
          </div>
        </div>
      </div>
    </div>
  );
};

export default TweetBox;
