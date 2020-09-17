import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router-dom';

import { authCheckState } from '../store/actions';

import MainPage from './MainPage';
import SignIn from './Auth/SignIn';
import SignUp from './Auth/SignUp';

import './App.css';
import Navbar from './Navbar/Navbar';
import Tweet from './Tweet/Tweet';
import TweetBox from './Tweet/TweetBox';
import Profile from './Profile/Profile';
import CreateTweet from './Tweet/CreateTweet';

export class App extends Component {
  componentDidMount = () => {
    console.log('token: ', this.props.token);
    console.log('token Storage: ', this.props);
    console.log('isAuthenticated: ', this.props.isAuthenticated);
    this.props.authCheckState();
  };

  render() {
    let routes = (
      <Switch>
        <Route exact path="/signup" component={SignUp} />
        <Route path="/login" component={SignIn} />
        <Route exact path="/home" component={MainPage} />
        <Redirect to="/login" />
      </Switch>
    );

    if (this.props.isAuthenticated) {
      routes = (
        <Switch>
          <Route exact path="/profile" component={Profile} />
          <Route path="/tweets" component={Tweet} />
          <Route exact path="/compose/tweet" component={CreateTweet} />
          <Route path="/setting" component={SignIn} />
          <Route exact path="/home" component={MainPage} />
          <Redirect to="/home" />
        </Switch>
      );
    }
    return (
      <div>
        <Navbar />
        {routes}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  console.log('state: ', state);
  return {
    isAuthenticated: state.user.token !== '',
    token: state.user.token,
  };
};

export default connect(mapStateToProps, { authCheckState })(App);
