import React, { Component } from 'react';
import { connect } from 'react-redux';
import dateFormat from 'dateformat';
import { Link, withRouter } from 'react-router-dom';
import {
  FaComment,
  FaRegComment,
  FaRegHeart,
  FaHeart,
  FaUser,
  FaTrashAlt,
} from 'react-icons/all';
import classes from './TweetBox.module.css';
import Spinner from '../Spinner/Spinner';
import Modal from '../../hoc/Modal/Modal';

import {
  fetchTweetLikes,
  likeATweet,
  unlikeATweet,
  createNewTweet,
  deleteTweet,
} from '../../store/actions';

import axios from 'axios';

class TweetBox extends Component {
  state = {
    likes: null,
    user: null,
    isLiked: false,
    isCommented: false,
    comments: [],
    isLoading: true,
  };

  componentDidMount = () => {
    this.getTweetLikes();
    this.getTweetComments();
    this.getUserById();
    console.log('this.props :>> ', this.props);
  };

  getTweetLikes = async () => {
    try {
      const res = await axios.get(`/api/tweets/${this.props.id}/likes`);
      const likes = res.data;
      this.setState({ likes });
      const like = likes.filter(
        (like) => like.user === this.props.myID && like.tweet === this.props.id
      );

      this.setState({
        isLoading: false,
      });
      this.setState({ isLiked: like.length !== 0 });
    } catch (error) {
      console.log('error :>> ', error);
    }
  };

  getTweetComments = async () => {
    try {
      const res = await axios.get(`/api/tweets/${this.props.id}/comments`);
      const comments = res.data;
      this.setState({ comments });
      const comment = comments.filter(
        (comment) =>
          comment.user === this.props.myID && comment.tweet === this.props.id
      );
      this.setState({ isCommented: comment.length !== 0 });
    } catch (error) {
      console.log('error :>> ', error);
    }
  };

  getUserById = async () => {
    try {
      const res = await axios.get(`/api/users/${this.props.userID}`);
      const user = res.data;
      this.setState({ user });
    } catch (error) {
      console.log('error :>> ', error);
    }
  };

  addComment = (event) => {
    event.stopPropagation();
    const tweet = this.props.id;
    //this.props.history.push('/compose/tweet/${tweet}');
    this.props.history.push(`/compose/tweet`, { tweet });
    //this.props.match.params = { tweet };
    //console.log(this.props.match.params);
  };

  deleteTweet = (event) => {
    event.stopPropagation();
    console.log('deleteTweet');
    document.getElementById('myModal').style.display = 'block';
    this.props.onDeleteTweet(this.props.id);
  };

  likeHandler = (event) => {
    event.stopPropagation();
    console.log('likeHandler');
    if (!this.props.isAuthenticated) {
      this.props.history.push('/login');
    } else {
      if (this.state.isLiked) {
        this.props.onUnlikeATweet(this.props.id);
        //this.setState({ isLiked: false });
      } else {
        //this.setState({ isLiked: true });
        this.props.onLikeATweet(this.props.id);
      }
      this.getTweetLikes();
    }
  };

  render() {
    const { isCommented, isLiked, likes, user, comments } = this.state;
    const { text, date, myID } = this.props;

    if (!likes || !user) {
      return <Spinner />;
    }
    const logo = user.avatar ? (
      <img
        src={`/api/users/${this.props.userID}/avatar`}
        alt="logo"
        onClick={(event) => event.stopPropagation()}
      />
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
      <>
        <Modal actions={() => this.props.history.go(0)}>
          <p>You deleted your tweet</p>
        </Modal>
        <div
          className={classes.main}
          onClick={() => this.props.history.push(`/tweets/${this.props.id}`)}
        >
          <Link to={`/users/${user.username}`} className={classes.logo}>
            {logo}
          </Link>
          <div className={classes.wrapper}>
            <div className={classes.identifier}>
              <Link
                to={`/users/${user.username}`}
                className={classes.name}
                onClick={(event) => event.stopPropagation()}
              >
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
              <div
                className={classes.comment}
                onClick={(event) => this.addComment(event)}
              >
                <div className={classes.icon}>
                  {isCommented ? <FaComment /> : <FaRegComment />}
                </div>

                <div className={classes.count}>{comments.length}</div>
              </div>
              <div
                className={classes.like}
                onClick={(event) => this.likeHandler(event)}
              >
                <div className={classes.icon}>
                  {isLiked ? <FaHeart /> : <FaRegHeart />}
                </div>
                <div className={classes.count}>{likes.length}</div>
              </div>
              {user._id === myID ? (
                <div
                  className={classes.delete}
                  onClick={(event) => this.deleteTweet(event)}
                >
                  <div className={classes.icon}>
                    <FaTrashAlt />
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </>
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
    onCreateNewTweet: (data) => dispatch(createNewTweet(data)),
    onLikeATweet: (id) => dispatch(likeATweet(id)),
    onUnlikeATweet: (id) => dispatch(unlikeATweet(id)),
    onDeleteTweet: (id) => dispatch(deleteTweet(id)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(TweetBox));
