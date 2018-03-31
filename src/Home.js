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
      <div className="pa2 center w-50 tj">
        <p>
          It is imperative that Democrats retake at least the House of Representatives in November 2018. We desperately need a check on the chaos and corruption of the Trump administration.</p>
      <p>To win the House, we will need many people who don't normally vote in mid-term elections to show up and vote.</p>
      <p>Academic research has shown that social pressure from fellow citizens can dramatically boost turnout.</p>
      <p>In 2017, a Vote Forward pilot project sent 1000 letters in a randomized trial and achieved a nearly 8% increase in turnout in the Alabama Special election.</p>
      <p>Now we're making the tools we used available to the public. We're aiming to send 10,000 letters by November.</p>
      <p>If you want to help Democrats win the House, especially if you're an introvert who doesn't like making phone calls or knocking on doors, the best thing you can do is send letters in mail. </p>
      <p>Vote Forward will help you ‘adopt’ some unlikely voters in swing districts and send them letters (physical letters, in the mail) pleading with them to commit to vote in the mid-term elections on Tuesday, November 6, 2018.
      <p>Will you send 10 letters this week? Yes? Good!</p>
        </p>
        { !this.fullyAgreed() ? (
          <div id="disclaimer">
            <p>First, we need to make sure you’re a human being...</p>
            <div className="dib">
              <RecaptchaComponent handleSuccess={this.handleCaptchaSuccess.bind(this)}/>
            </div>
            <p>As a user of Vote Forward, you will receive information about your fellow citizens, including their names, addresses and voting histories.
            States make this data available to organizations and members of the public in the interest of transparency and facilitating political activity.</p>
            <p>By proceeding, you are agreeing to our code of conduct: Be a good citizen. Take care to keep the data you receive private. And in your letters, be genuine and passionate, but most importantly be respectful.</p>
            <p>We are confident that you will conduct yourself in an upstanding fashion, but we reserve the right to disable your account if you don’t.</p>
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
