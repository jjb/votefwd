// src/Home.js

import React, { Component } from 'react';
import { Header } from './Header';
import { Login } from './Login';
import './App.css';

class Welcome extends Component {
  render() {
    return (
      <div className="pa2 center w-50 tj">
      <h1>Let’s take back our House</h1>
      <p>Democrats must retake the House of Representatives in November, 2018. We need a check on the chaos and corruption of the Trump administration.</p>
      <p>We can do this. SwingLeft has identified 70 Swing districts. We need 24.</p> 
      <p>But we’re going to need people who wouldn’t normally vote to turn out.</p>
      <p>Researchers have shown that social pressure from fellow citizens can dramatically boost turnout.</p>
      <p>In 2017, a Vote Forward pilot sent 1000 letters in a randomized trial, and achieved an 8% increase in turnout in the Alabama Special election.</p>
      <p>Now we’re making the tools we used available to the public.</p>
      <h1>Adopt a swing voter today</h1>
      <p>If you’re an introvert who doesn’t like making phone calls or knocking on doors, you can send letters in the mail.</p>
      <p>We’ll help you ‘adopt’ some unlikely Democratic voters in swing districts, and send them letters asking them to vote.</p>
      <p>Will you send 10 letters this week? Yes? Good!</p>
      <Login auth={this.props.auth} buttonText="Sign Up To Send Letters" />
      </div>
    );
  }
}

class Home extends Component {
  render() {
    return (
      <div className="sans-serif tc">
        <Header />
        { !this.props.auth.isAuthenticated() ? (
          <div>
            <Welcome auth={this.props.auth} />
          </div>
        ) : (
          <div>
            <Login auth={this.props.auth} />
            <a href="/dashboard">Go to dashboard and send letters.</a>
          </div>
        ) }
        <a className="link mv6 dib" href="/pledge">(Got a letter? Click here to pledge to be a voter)</a>:
      </div>
    );
  }
}

export default Home;
