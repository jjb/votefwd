// src/Qualify.js

import React, { Component } from 'react';
import { RecaptchaComponent } from './Recaptcha';

export class Qualify extends Component {
  constructor(props) {
    super(props);
    this.state = {
      passedCaptcha: false,
      agreedCode: false,
      isCitizen: false
    }
  }

  toggleCode() {
    this.setState({ agreedCode: !this.state.agreedCode});
  }

  handleCaptchaSuccess(value) {
    this.setState({ passedCaptcha: !this.state.passedCaptcha});
  }

  toggleCitizen() {
    this.setState({ isCitizen: !this.state.isCitizen});
  }

  fullyAgreed() {
    if ( this.state.passedCaptcha &&
         this.state.agreedCode &&
         this.state.isCitizen
    ) {
      return true
    }
    else {
      return false
    }
  }

  render() {
    if (!this.fullyAgreed()) {
      return (
        <div className="w-50 center">
          <p>First, we need to make sure of a few things...</p>
          <p className="f4">1. Are you a robot?</p>
            <div className="center dib">
              <RecaptchaComponent handleSuccess={this.handleCaptchaSuccess.bind(this)}/>
            </div>
          <p className="f4">2. What’s your full name?</p>
            <div className="center dib">
              <input className="" type="textarea"/>
            </div>
          <p className="f4">3. Are you a U.S. Citizen?</p>
            <label className="mr2">Yes.</label>
            <input className="ph2 " onClick={this.toggleCitizen.bind(this)} type="checkbox" />
          <p className="f4">4. What’s your ZIP code?</p>
            <input className="" type="textarea"/>
          <p className="f4">5. Do you agree to abide by our code of conduct?</p>
            <p>It’s a short: be decent: kind, respectful, sincere, and neighborly.</p>
            <label className="mr2">Yes.</label>
            <input className="ph2" onClick={this.toggleCode.bind(this)} type="checkbox" />
        </div>
      )
    }
    else return null
  }
}
