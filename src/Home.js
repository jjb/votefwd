// src/Home.js

import React, { Component } from 'react';
import { RecaptchaComponent } from './Recaptcha';
import { Header } from './Header';
import { Login } from './Login';
import './App.css';

class Welcome extends Component {
  constructor(props) {
    super(props)
    this.state = { passedCaptcha: false, agreedTerms: false }

    this.toggleAgreeTerms= this.toggleAgreeTerms.bind(this);
  }

  toggleAgreeTerms() {
    this.setState({ agreedTerms: !this.state.agreedTerms});
  }

  handleCaptchaSuccess(value) {
    this.setState({ passedCaptcha: !this.state.passedCaptcha});
  }

  fullyAgreed() {
    if (this.state.passedCaptcha && this.state.agreedTerms) {
      return true
    }
    else {
      return false
    }
  }

  render() {
    return (
      <div className="pa2">
        <p className="center w-50 tj">
          Welcome! Vote Forward is an independent organization that works to increase voter turnout. We provide tools for citizens to ‘adopt‘ unlikely voters in swing districts and send them letters (physical letters, in the mail!) pleading with them to commit to vote in the mid-term elections on Tuesday, November 6, 2018.
        </p>
        { !this.fullyAgreed() ? (
          <div id="disclaimer">
            <p>First, we need to make sure you’re a human being...</p>
            <div className="dib">
              <RecaptchaComponent handleSuccess={this.handleCaptchaSuccess.bind(this)}/>
            </div>
            <p className="center w-50 tj">As a user of Vote Forward, you will receive information about your fellow citizens, including their names, addresses and voting histories.
            States make this data available to organizations and members of the public in the interest of transparency and facilitating political activity.
            By proceeding, you are agreeing to our code of conduct: Be a good citizen. Take care to keep the data you receive private. And in your letters, be genuine and passionate, but most importantly be respectful.</p>
            <p className="center w-50 tj">We are confident that you will conduct yourself in an upstanding fashion, but we reserve the right to disable your account if you don’t.</p>
            <label className="mr2">Yes, I agree to the code of conduct and <a href="/terms">terms of use</a>.</label> 
            <input className="ph2" onClick={this.toggleAgreeTerms} type="checkbox" />
          </div> ) : (
            <Login auth={this.props.auth} buttonText="Sign Up To Send Letters" />
          )
        }
      </div>
    )
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
