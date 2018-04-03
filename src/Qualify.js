// src/Qualify.js

import React, { Component } from 'react';
import { RecaptchaComponent } from './Recaptcha';
import axios from 'axios';

export class Qualify extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      isHuman: false,
      isResident: false,
      agreedCode: false,
      zip: '',
      fullName: ''
    }
  }

  handleCaptchaSuccess(value) {
    axios({
      method: 'POST',
      url: `${process.env.REACT_APP_API_URL}/user`,
      data: { auth0_id: 'auth0|5aac2cd53092f503a3de2509', isHuman: true }
    })
    .then(res => {
      console.log(res)
    })
    .catch(err => {
      console.error(err);
    });
    this.setState({ isHuman: true });
  }

  handleIsResident() {
    this.setState({ isResident: true });
  }

  handleAgreedCode() {
    this.setState({ agreedCode: true });
  }

  componentWillMount() {
    axios({
      method: 'GET',
      url: `${process.env.REACT_APP_API_URL}/user`,
      // now get this from localStorage
      params: { auth0_id: 'auth0|5aac2cd53092f503a3de2509' }
    })
    .then(res => {
      // write a function that updates all elements of state based on the
      // response
      this.setState({user: res.data[0]});
      if(res.data[0].is_human_at) {
        this.setState({ isHuman: true });
      }
    })
    .catch(err => {
      console.error(err);
    });
  }

  isQualified() {
    if ( this.state.isHuman &&
      this.state.agreedCode &&
      this.state.isResident &&
      this.state.zip &&
      this.state.fullName
    ) {
      return true
    }
    else {
      return false
    }
  }

  render() {
    let formMarkup;

    let captchaQ = (
      <div>
      <p className="f4">1. Are you a robot?</p>
        <div className="center dib">
          <RecaptchaComponent handleSuccess={this.handleCaptchaSuccess.bind(this)}/>
        </div>
      </div>
    );

    let nameQ = (
      <div>
      <p className="f4">2. What’s your full name?</p>
        <div className="center dib">
          <input className="" type="textarea"/>
        </div>
      </div>
    );

    let residentQ = (
      <div>
        <p className="f4">3. Are you a U.S. Citizen or permanent resident?</p>
        <label className="mr2">Yes.</label>
        <input className="ph2 " onClick={this.handleIsResident.bind(this)} type="checkbox" />
      </div>
    )

    let zipQ = (
      <div>
        <p className="f4">4. What’s your ZIP code?</p>
        <input className="" type="textarea"/>
      </div>
    )

    let codeQ = (
      <div>
        <p className="f4">5. Do you agree to abide by our code of conduct?</p>
        <p>It’s short: be decent, i.e., kind, respectful, sincere, and neighborly.</p>
        <label className="mr2">Yes.</label>
        <input className="ph2" onClick={this.handleAgreedCode.bind(this)} type="checkbox" />
      </div>
    )

    if (!this.state.isHuman) {
      formMarkup = captchaQ;
    }
    else if (!this.state.fullName) {
      formMarkup = nameQ;
    }
    else if (!this.state.isResident) {
      formMarkup = residentQ;
    }
    else if (!this.state.zip) {
      formMarkup = zipQ;
    }
    else if (!this.state.agreedCode) {
      formMarkup = codeQ;
    }
    else {
      formMarkup = null;
    }

    return (
      <div className="w-50 center">
        <p>First, we need to make sure of a few things...</p>
        {formMarkup}
      </div>
    )
  }
}
