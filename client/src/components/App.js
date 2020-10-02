import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router-dom';

import { authCheckState, fetchTweets, fetchUsers } from '../store/actions';

import Home from './Home/Home';
import SignIn from './Auth/SignIn';
import SignUp from './Auth/SignUp';

import Tweet from './Tweet/Tweet';
import Profile from './Profile/Profile';
import CreateTweet from './Tweet/CreateTweet';
import Layout from '../hoc/Layout/Layout';
import EditProfile from './EditProfile/EditProfile';

export class App extends Component {
  componentDidMount = () => {
    this.props.authCheckState();
    this.props.fetchTweets();
    this.props.fetchUsers();
    this.intervalID = setInterval(this.fetchTweets, 5000);
  };

  componentWillUnmount = () => {
    clearInterval(this.intervalID);
  };

  render() {
    let routes = (
      <Switch>
        <Route exact path="/signup" component={SignUp} />
        <Route path="/login" component={SignIn} />
        <Route path="/users/:username" component={Profile} />
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
          <Route path="/setting" component={SignIn} />
          <Route exact path="/home" component={Home} />
          <Redirect to="/home" />
        </Switch>
      );
    }
    return <Layout>{routes}</Layout>;
  }
}

const mapStateToProps = ({ auth }) => {
  return {
    isAuthenticated: !!auth.token,
    token: auth.token,
  };
};

export default connect(mapStateToProps, {
  authCheckState,
  fetchTweets,
  fetchUsers,
})(App);
