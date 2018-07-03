// src/Home.js

import React, { Component } from 'react';
import { Header } from './Header';
import { Login } from './Login';

class Welcome extends Component {
  render() {
    return (
      <div className="justify-items-center">
        { this.props.auth.isAuthenticated() ?
          (
            <div className="text-center pt-5 pb-5">
              <a className="btn-lg" href="/dashboard">You’re signed in. Click here to send letters!</a>
            </div>
          ) :
          (
            <div className="text-center pt-5 pb-5">
              <Login auth={this.props.auth} buttonText="Sign Up Or Log In To Send Letters" />
            </div>
          )
        }
      </div>
    );
  }
}

class Home extends Component {
  render() {
    return (
      <div className="sans-serif tc">
        <Header auth={this.props.auth} />
        <Welcome auth={this.props.auth} />
        <div className="text-center">
          <p>Received a letter? <a className="link" href="/pledge">Click here to pledge to vote</a>.</p>
          <p>Not sure what this is? <a className="link" target="_blank" rel="noopener noreferrer" href="https://votefwd.org">Click here to learn more</a>.</p>
        </div>
      </div>
    );
  }
}

export default Home;
