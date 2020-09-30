import React from 'react';
import TweetBox from './TweetBox';

import classes from './TweetBox.module.css';

const TweetsList = ({ tweets, message }) => {
  let list;
  if (tweets.length === 0) {
    list = <div className={classes.message}>{message}</div>;
  } else {
    list = (
      <div>
        {tweets.map((tweet) => (
          <TweetBox
            key={tweet._id}
            id={tweet._id}
            text={tweet.text}
            userID={tweet.user}
            media={tweet.media}
            date={tweet.updatedAt || ''}
          />
        ))}
      </div>
    );
  }
  return list;
};

export default TweetsList;
