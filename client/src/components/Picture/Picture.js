import React from 'react';
import { GiClawSlashes } from 'react-icons/gi';
import { connect } from 'react-redux';
import classes from './Picture.module.css';
const Picture = (props) => {
  return (
    <div className={GiClawSlashes.modal}>
      <div className={GiClawSlashes.content}>
        <img src={`pic`} alt={`pic`} />
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  console.log('state :>> ', state);
  return {
    tweets: state.tweet.user,
    user: state.user.user,
    userID: state.user.userID,
  };
};

export default connect(mapStateToProps)(Picture);
