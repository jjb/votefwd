// src/Home.js

import React, { Component } from 'react';
import { Header } from './Header';
import { Login } from './Login';
import './App.css';

class Welcome extends Component {
  render() {
    return (
      <div className="pa2">
        <p className="tc">
          Welcome! Vote Forward is...
        </p>
        <p>Before you begin, we want to make sure you’re a responsible human being.</p>
        <p>Captcha</p>
        <p>Code of conduct</p>
        <p>Agree to terms</p>
      </div>
    )
  }
}

class Home extends Component {
  render() {
    return (
      <div className="sans-serif tc">
        <Header auth={this.props.auth}/>
        <Welcome />
        <Login auth={this.props.auth} buttonText="Sign Up or Log In To Send Letters" />
        <a className="link mv6 dib" href="/pledge">(Got a letter? Click here to pledge to be a voter)</a>
      </div>
    );
  }
}

export default Home;
