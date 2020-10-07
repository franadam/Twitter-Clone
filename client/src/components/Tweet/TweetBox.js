import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import dateFormat from 'dateformat';
import { Link, withRouter } from 'react-router-dom';
import {
  FaComment,
  FaHeart,
  FaRegComment,
  FaRegHeart,
  FaTrashAlt,
} from 'react-icons/all';
import classes from './TweetBox.module.css';
import Spinner from '../UI/Spinner/Spinner';
import Modal from '../../hoc/Modal/Modal';

import {
  createNewTweet,
  deleteTweet,
  likeATweet,
  unlikeATweet,
} from '../../store/actions';

import Avatar from '../UI/Avatar/Avatar';

class TweetBox extends Component {
  state = {
    isLiked: false,
    isCommented: false,
    isLoading: true,
  };

  addComment = (event) => {
    event.stopPropagation();
    const tweet = this.props.id;
    // This.props.history.push('/compose/tweet/${tweet}');
    this.props.history.push('/compose/tweet', { tweet });
    // This.props.match.params = { tweet };
    // //console.log(this.props.match.params);
  };

  deleteTweet = (event) => {
    event.stopPropagation();
    // Console.log('deleteTweet');
    document.getElementById('myModal').style.display = 'block';
    this.props.onDeleteTweet(this.props.id);
  };

  showImage = (event) => {
    event.stopPropagation();
    // Console.log('showImage');
    document.getElementById('myModal').style.display = 'block';
    // This.props.history.push(`/api/tweets/${this.props.id}/media`);
  };

  likeHandler = (event) => {
    event.stopPropagation();
    const { likes } = this.props,
      like = likes.find(
        (like) => like.user === this.props.myID && like.tweet === this.props.id
      );
    console.log('likeHandler, like, likes', like, likes);
    if (!this.props.isAuthenticated) {
      this.props.history.push('/login');
    } else {
      if (like) {
        this.props.onUnlikeATweet(this.props.id);
        this.setState({ isLiked: false });
      } else {
        this.props.onLikeATweet(this.props.id);
        this.setState({ isLiked: true });
      }
      // This.getTweetLikes();
    }
  };

  render() {
    const { isCommented, isLiked } = this.state,
      { text, users, date, media, myID, likes, comments } = this.props,
      user = users.find((user) => user._id === this.props.userID);

    if (!user) {
      return <Spinner />;
    }

    const myLike =
        likes.find(
          (like) =>
            like.user === this.props.myID && like.tweet === this.props.id
        ) || {},
      myComment =
        comments.find((comment) => comment.user === this.props.myID) || {},
      getDate = (date) => {
        const sec = Math.ceil(
            (new Date().getTime() - new Date(date).getTime()) / 1000
          ),
          min = Math.ceil(sec / 60),
          hour = Math.ceil(sec / 3600);
        if (hour >= 24) {
          return dateFormat(new Date(date), 'mmm d');
        } else if (sec < 60 && min < 60 && hour < 24) {
          return `${sec}s`;
        } else if (min < 60 && hour < 24) {
          return `${min}m`;
        } else if (hour < 24) {
          return `${hour}h`;
        }
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
          <Link className={classes.logo} to={`/users/${user.username}`}>
            <Avatar
              avatar={user.avatar}
              size="4rem"
              userID={this.props.userID}
            />
          </Link>
          <div className={classes.wrapper}>
            <div className={classes.identifier}>
              <Link
                className={classes.name}
                onClick={(event) => event.stopPropagation()}
                to={`/users/${user.username}`}
              >
                <div className={classes.fullname}>{user.fullname}</div>
                <div className={classes.username}>@{user.username}</div>
              </Link>
              <time className={classes.date} dateTime={date}>
                {getDate(date)}
              </time>
            </div>
            <div className={classes.text}>{text}</div>
            {media ? (
              <div
                className={classes.media}
                onClick={(event) => this.showImage(event)}
              >
                <img alt="media" src={`/api/tweets/${this.props.id}/media`} />
              </div>
            ) : null}
            <div className={classes.activity}>
              <div
                className={classes.comment}
                onClick={(event) => this.addComment(event)}
              >
                <div className={classes.icon}>
                  {isCommented || myComment._id ? (
                    <FaComment className={classes.commented} />
                  ) : (
                    <FaRegComment />
                  )}
                </div>

                <div className={classes.count}>{comments.length}</div>
              </div>
              <div
                className={classes.like}
                onClick={(event) => this.likeHandler(event)}
              >
                <div className={classes.icon}>
                  {isLiked || myLike._id ? (
                    <FaHeart className={classes.liked} />
                  ) : (
                    <FaRegHeart />
                  )}
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

const mapStateToProps = ({ user, auth }) => ({
    myID: auth.userID,
    users: user.users,
    isAuthenticated: Boolean(auth.token),
  }),
  mapDispatchToProps = (dispatch) => ({
    onCreateNewTweet: (data) => dispatch(createNewTweet(data)),
    onLikeATweet: (id) => dispatch(likeATweet(id)),
    onUnlikeATweet: (id) => dispatch(unlikeATweet(id)),
    onDeleteTweet: (id) => dispatch(deleteTweet(id)),
  });

TweetBox.propTypes = {
  history: PropTypes.object,
  match: PropTypes.object,
  location: PropTypes.object,
  userID: PropTypes.string,
  id: PropTypes.string,
  myID: PropTypes.string,
  date: PropTypes.string,
  media: PropTypes.string,
  text: PropTypes.string,
  isAuthenticated: PropTypes.bool,
  likes: PropTypes.arrayOf(PropTypes.object),
  comments: PropTypes.arrayOf(PropTypes.object),
  users: PropTypes.arrayOf(PropTypes.object),
  onLikeATweet: PropTypes.func,
  onCreateNewTweet: PropTypes.func,
  onUnlikeATweet: PropTypes.func,
  onDeleteTweet: PropTypes.func,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(TweetBox));
