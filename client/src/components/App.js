import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router-dom';

import { authCheckState, fetchTweets } from '../store/actions';

import Home from './Home/Home';
import SignIn from './Auth/SignIn';
import SignUp from './Auth/SignUp';

import Tweet from './Tweet/Tweet';
import Profile from './Profile/Profile';
import CreateTweet from './Tweet/CreateTweet';
import Layout from '../hoc/Layout/Layout';

export class App extends Component {
  componentDidMount = () => {
    this.props.authCheckState();
    this.props.fetchTweets();
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
          <Route path="/users/:username" component={Profile} />
          <Route path="/tweets/:tweetID" component={Tweet} />
          <Route path="/compose/tweet/:tweetID" component={CreateTweet} />
          <Route exact path="/compose/tweet" component={CreateTweet} />
          <Route path="/setting" component={SignIn} />
          <Route exact path="/home" component={Home} />
          <Redirect to="/home" />
        </Switch>
      );
    }
    return <Layout>{routes}</Layout>;
  }
}

const mapStateToProps = ({ user }) => {
  return {
    isAuthenticated: user.isAuthenticated,
    token: user.token,
  };
};

export default connect(mapStateToProps, { authCheckState, fetchTweets })(App);
