// src/Home.js

import React, { Component } from 'react';
import { Header } from './Header';
import { Login } from './Login';
import './App.css';

class Welcome extends Component {
  render() {
    return (
      <div className="pa2 center w-50 tj">
        <h2 className="display-2">Flip Congress Blue</h2>
        <h3 className="display-4 mb-3">Send Letters to Democrats</h3>
        <p className="mb-3">‘Adopt’ unlikely Democratic voters in key swing districts and send them letters pleading with them to vote.
        In a recent experiment, Vote Forward letters boosted turnout by 3.9 percentage points. This is huge!
        It may be the single most impactful thing you can do this year. And it takes just 2 minutes and a stamp.</p>
        <p>Visit <a href="https://votefwd.org">www.votefwd.org</a> to learn more, then sign up and send some letters.</p>
        { this.props.auth.isAuthenticated() ?
          (
            <a className="button link dib mt4" href="/dashboard">You’re already logged in. Click here to send letters!</a>
          ) :
          (
            <Login auth={this.props.auth} buttonText="Sign Up Or Log In To Send Letters" />
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
        <a className="link tc mv6 w-50 center" href="/pledge">Received a letter? Click here to pledge.</a>
      </div>
    );
  }
}

export default Home;
