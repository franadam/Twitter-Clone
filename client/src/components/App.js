import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';

import { authCheckState, fetchTweets, fetchUsers } from '../store/actions';

import Home from './Home/Home';
import SignIn from './Auth/SignIn';
import SignUp from './Auth/SignUp';

import Tweet from './Tweet/Tweet';
import Profile from './Profile/Profile';
import CreateTweet from './Tweet/CreateTweet';
import Layout from '../hoc/Layout/Layout';
import EditProfile from './EditProfile/EditProfile';
import Follows from './Follows/Follows';

export class App extends Component {
  componentDidMount = () => {
    this.props.authCheckState();
    this.props.fetchTweets();
    this.props.fetchUsers();
  };

  render() {
    let routes = (
      <Switch>
        <Route exact path="/signup" component={SignUp} />
        <Route path="/login" component={SignIn} />
        <Route exact path="/users/:username" component={Profile} />
        <Route path="/tweets/:tweetID" component={Tweet} />
        <Redirect to="/login" />
      </Switch>
    );
    if (this.props.isAuthenticated) {
      //
      routes = (
        <Switch>
          <Route exact path="/users/:username" component={Profile} />
          <Route path="/tweets/:tweetID" component={Tweet} />
          <Route path="/compose/tweet" component={CreateTweet} />
          <Route exact path="/users/:username/edit" component={EditProfile} />
          <Route exact path="/users/:username/follow" component={Follows} />
          <Route path="/setting" component={SignIn} />
          <Route exact path="/home" component={Home} />
          <Redirect to="/home" />
        </Switch>
      );
    }
    return <Layout>{routes}</Layout>;
  }
}

const mapStateToProps = ({ auth }) => ({
  isAuthenticated: Boolean(auth.token),
});

App.propTypes = {
  isAuthenticated: PropTypes.bool,
  authCheckState: PropTypes.func,
  fetchTweets: PropTypes.func,
  fetchUsers: PropTypes.func,
};

export default connect(mapStateToProps, {
  authCheckState,
  fetchTweets,
  fetchUsers,
})(App);
