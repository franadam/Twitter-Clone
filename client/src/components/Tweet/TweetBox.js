import React, { Component } from 'react';
import { connect } from 'react-redux';
import dateFormat from 'dateformat';
import { Link, withRouter } from 'react-router-dom';
import { FaRegComment, FaRegHeart, FaHeart, FaUser } from 'react-icons/all';
import classes from './TweetBox.module.css';

import {
  fetchTweetLikes,
  fetchCurrentUser,
  likeATweet,
  unlikeATweet,
} from '../../store/actions';

import axios from 'axios';
import user from '../../store/reducers/user';
class TweetBox extends Component {
  state = { likes: null, user: null, isLiked: false };

  componentDidMount = () => {
    this.getTweetLikes();
    this.getUserById();
    //this.isLiked();
  };

  componentWillUnmount = () => {};

  getTweetLikes = async () => {
    const res = await axios.get(`/api/tweets/${this.props.id}/likes`);
    const likes = res.data;
    this.setState({ likes });
    const like = likes.filter(
      (like) => like.user === this.props.myID && like.tweet === this.props.id
    );
    console.log('isLiked like :>> ', like.length !== 0, like);
    this.setState({ isLiked: like.length !== 0 });
  };

  getUserById = async () => {
    const res = await axios.get(`/api/users/${this.props.userID}`);
    const user = res.data;
    this.setState({ user });
  };

  likeHandler = () => {
    if (this.state.isLiked) {
      this.props.onUnlikeATweet(this.props.id);
      //this.setState({ isLiked: false });
    } else {
      //this.setState({ isLiked: true });
      this.props.onLikeATweet(this.props.id);
    }
    this.getTweetLikes();
  };

  render() {
    const { isLiked, likes, user } = this.state;
    const { text, date } = this.props;

    if (!likes || !user) {
      return null;
    }
    const logo = user.avatar ? (
      <img src={`/api/users/${this.props.userID}/avatar`} alt="logo" />
    ) : (
      <FaUser color="#f0f8ff" size="2rem" />
    );

    const getDate = (date) => {
      const sec = (-new Date(date).getTime() + new Date().getTime()) / 1000;
      const hour = Math.ceil(sec / 3600);
      if (hour >= 24) return dateFormat(new Date(date), 'mmm d');
      return `${hour}h`;
    };

    return (
      <div className={classes.main}>
        <Link to={`/users/${user.username}`} className={classes.logo}>
          {logo}
        </Link>
        <div className={classes.wrapper}>
          <div className={classes.identifier}>
            <Link to={`/users/${user.username}`} className={classes.name}>
              <div className={classes.fullname}>{user.fullname}</div>
              <div className={classes.username}>@{user.username}</div>
            </Link>
            <time dateTime={date} className={classes.date}>
              {getDate(date)}
            </time>
          </div>
          <div className={classes.text}>{text}</div>
          <div className={classes.image}></div>
          <div className={classes.activity}>
            <div className={classes.comment}>
              <FaRegComment />
              <div className={classes.count}>22</div>
            </div>
            <div className={classes.like} onClick={() => this.likeHandler()}>
              {isLiked ? <FaHeart /> : <FaRegHeart />}
              <div className={classes.count}>{likes.length}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ tweet, user }) => {
  return {
    likes: tweet.likes,
    myID: user.userID,
    isAuthenticated: user.token !== '',
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchTweetLikes: (id) => dispatch(fetchTweetLikes(id)),
    onFetchCurrentUser: () => dispatch(fetchCurrentUser()),
    onLikeATweet: (id) => dispatch(likeATweet(id)),
    onUnlikeATweet: (id) => dispatch(unlikeATweet(id)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(TweetBox));
