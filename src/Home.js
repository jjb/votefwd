// src/Home.js

import React, { Component } from 'react';
import { Header } from './Header';
import { Login } from './Login';
import './App.css';

class Welcome extends Component {
  render() {
    return (
      <div className="pa2 center w-50 tj">
      <p>It is imperative that Democrats retake at least the House of Representatives in November 2018. We desperately need a check on the chaos and corruption of the Trump administration.</p>
      <p>To win the House, we will need many people who don’t normally vote in mid-term elections to show up and vote.</p>
      <p>Academic research has shown that social pressure from fellow citizens can dramatically boost turnout.</p>
      <p>In 2017, a Vote Forward pilot project sent 1000 letters in a randomized trial and achieved a nearly 8% increase in turnout in the Alabama Special election.</p>
      <p>Now we're making the tools we used available to the public. We're aiming to send 10,000 letters by November.</p>
      <p>If you want to help Democrats win the House, especially if you’re an introvert who doesn’t like making phone calls or knocking on doors, the best thing you can do is send letters in mail.</p>
      <p>Vote Forward will help you ‘adopt’ some unlikely voters in swing districts and send them letters pleading with them to commit to vote in the mid-term elections on Tuesday, November 6, 2018.</p>
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
        <a className="link mv6 dib" href="/pledge">(Got a letter? Click here to pledge to be a voter)</a>
      </div>
    );
  }
}

export default Home;
