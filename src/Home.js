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
    this.setState({ agreedTerms: !this.state.agreedTerms}, function() {
      console.log(this.state.agreedTerms)
    });
  }

  handleCaptchaSuccess(value) {
    console.log(value);
    this.setState({ passedCaptcha: !this.state.passedCaptcha}, function() {
      console.log(this.state.passedCaptcha);
    });
  }

  render() {
    return (
      <div className="pa2">
        <p className="center w-40 tj">
          Welcome! Vote Forward is an independent organization that works to increase voter turnout. We provide tools for citizens to ‘adopt‘ unlikely voters in swing districts and send them letters (physical letters, in the mail!) pleading with them to commit to vote in the mid-term elections on Tuesday, November 6, 2018. Interested? Good!
        </p>
        <p>First, we need to make sure you’re a responsible human being.</p>
        <div className="dib">
          <RecaptchaComponent handleSuccess={this.handleCaptchaSuccess.bind(this)}/>
        </div>
        <p className="center w-40 tj">As a user of Vote Forward, you will receive information about your fellow citizens, including their names and addresses.
        States make this data available to organizations and members of the public in the interest of transparency and facilitating political activity.
        By proceeding, you are agreeing to our code of conduct: be a good citizen. Take care to keep the data you receive private.</p>
        <p className="center w-40 tj">You will also be communicating with your fellow citizens in writing. Be genuine, be passionate, but most importantly be respectful.
          We are confident that you will conduct yourself in an upstanding fashion, but we reserve the right to disable your account if you don’t.</p>
        <label className="mr2">Yes, I agree to the code of conduct and <a href="/terms">terms of use</a>.</label> 
        <input className="ph2" onClick={this.toggleAgreeTerms} type="checkbox" />
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
