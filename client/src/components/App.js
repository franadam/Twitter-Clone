import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router-dom';

import { authCheckState } from '../store/actions';

import Home from './Home';
import SignIn from './Auth/SignIn';
import SignUp from './Auth/SignUp';

import './App.css';
import Navbar from './Navbar/Navbar';
import Tweet from './Tweet/Tweet';
import Profile from './Profile/Profile';
import Picture from './Picture/Picture';
import CreateTweet from './Tweet/CreateTweet';

export class App extends Component {
  componentDidMount = () => {
    console.log('token: ', this.props.token);
    console.log('token Storage: ', this.props);
    console.log('isAuthenticated: ', this.props.isAuthenticated);
    this.props.authCheckState();
  };

  render() {
    //<Redirect to="/login" />
    let routes = (
      <Switch>
        <Route exact path="/signup" component={SignUp} />
        <Route path="/login" component={SignIn} />
        <Route exact path="/users/:username/avatar" component={Picture} />
      </Switch>
    );

    if (this.props.isAuthenticated) {
      //<Redirect to="/home" />
      routes = (
        <Switch>
          <Route path="/users/:username" component={Profile} />
          <Route exact path="/users/:username/avatar" component={Picture} />
          <Route path="/tweets" component={Tweet} />
          <Route exact path="/compose/tweet" component={CreateTweet} />
          <Route path="/setting" component={SignIn} />
          <Route exact path="/home" component={Home} />
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
