import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';

import { authCheckState } from '../store/actions';

import MainPage from './MainPage';
import SignIn from './Auth/SignIn';
import SignUp from './Auth/SignUp';

import './App.css';
import Navbar from './Navbar/Navbar';

export class App extends Component {
  componentDidMount = () => {
    this.props.authCheckState();
  };
  render() {
    const routes = (
      <Switch>
        <Route exact path="/signup" component={SignUp} />
        <Route path="/login" component={SignIn} />
        <Route exact path="/" component={MainPage} />
      </Switch>
    );
    return (
      <div>
        {!this.props.isAuthenticated ? <Navbar /> : null}
        {routes}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  console.log('state: ', state);
  return {
    isAuthenticated: state.user.token !== null,
    token: state.user.token,
  };
};

export default connect(mapStateToProps, { authCheckState })(App);
