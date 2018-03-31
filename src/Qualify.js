// src/Qualify.js

import React, { Component } from 'react';
import { RecaptchaComponent } from './Recaptcha';

export class Qualify extends Component {
  constructor(props) {
    super(props);
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
      <div>
        <p>First, we need to make sure you’re a human being...</p>
        <RecaptchaComponent handleSuccess={this.handleCaptchaSuccess.bind(this)}/>
        <p>As a user of Vote Forward, you will receive information about your fellow citizens, including their names, addresses and voting histories.</p>
        <p>States make this data available to organizations and members of the public in the interest of transparency and facilitating political activity.</p>
        <p>By proceeding, you are agreeing to our code of conduct: Be a good citizen. Take care to keep the data you receive private. And in your letters, be genuine and passionate, but most importantly be respectful.</p>
        <p>We are confident that you will conduct yourself in an upstanding fashion, but we reserve the right to disable your account if you don’t.</p>
        <label className="mr2">Yes, I agree to the code of conduct and <a href="/terms">terms of use</a>.</label> 
        <input className="ph2" onClick={this.toggleAgreeTerms} type="checkbox" />
      </div>
    )
  }
}
