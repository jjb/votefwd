// src/Qualify.js

import React, { Component } from 'react';
import { RecaptchaComponent } from './Recaptcha';
import axios from 'axios';

export class Qualify extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isHuman: false,
      isResident: false,
      agreedCode: false,
      zip: '',
      fullName: '',
      nameFormVal: '',
      zipFormVal: '',
      gRecaptchaResponse: ''
    }

    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleNameSubmit = this.handleNameSubmit.bind(this);
    this.handleZipChange = this.handleZipChange.bind(this);
    this.handleZipSubmit = this.handleZipSubmit.bind(this);
  }

  handleCaptcha(response) {
    axios({
      method: 'POST',
      headers: {Authorization: 'Bearer '.concat(localStorage.getItem('access_token'))},
      url: `${process.env.REACT_APP_API_URL}/recaptcha`,
      data: {
        recaptchaResponse: response
      }
    })
    .then(res => {
      if (res.status === 200) {
        this.updateUser('isHuman', true);
        this.setState({
          isHuman: true,
          gRecaptchaResponse: response
        });
      } else {
        console.error('Something went wrong with validation of humanness.');
      }
    })
    .catch(err => {
      console.error(err);
    });
  }

  handleNameChange(event) {
    this.setState({ nameFormVal: event.target.value });
  }

  handleNameSubmit(event) {
    this.updateUser('fullName', this.state.nameFormVal);
    this.setState({ fullName: this.state.nameFormVal });
    event.preventDefault();
  }

  handleZipChange(event) {
    this.setState({ zipFormVal: event.target.value });
  }

  handleZipSubmit(event) {
    this.updateUser('zip', this.state.zipFormVal);
    this.setState({ zip: this.state.zipFormVal });
    event.preventDefault();
  }

  handleIsResident() {
    this.updateUser('isResident', true);
    this.setState({ isResident: true });
  }

  handleAgreedCode() {
    this.updateUser('agreedCode', true);
    this.setState({ agreedCode: true });
  }

  updateUser(key, value) {
    let data = {}
    data['auth0_id'] = localStorage.getItem('user_id');
    data[key] = value;
    axios({
      method: 'POST',
      headers: {Authorization: 'Bearer '.concat(localStorage.getItem('access_token'))},
      url: `${process.env.REACT_APP_API_URL}/user`,
      data: data
    })
    .catch(err => {
      console.error(err);
    });
  }

  componentWillMount() {
    let user = this.props.user;
    if (user) {
      this.setState({
        isHuman: user.is_human_at,
        isResident: user.is_resident_at,
        agreedCode: user.accepted_code_at,
        zip: user.zip,
        fullName: user.full_name
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    let user = nextProps.user;
    if (user) {
      this.setState({
        isHuman: user.is_human_at,
        isResident: user.is_resident_at,
        agreedCode: user.accepted_code_at,
        zip: user.zip,
        fullName: user.full_name
      })
    }
  }

  render() {

    let formMarkup;

    let captchaQ = (
      <div>
      <p className="f4">1. Are you a robot?</p>
        <div className="center dib">
          <RecaptchaComponent handleSuccess={this.handleCaptcha.bind(this)}/>
        </div>
      </div>
    );

    let nameQ = (
      <form onSubmit={this.handleNameSubmit}>
      <p className="f4">2. What’s your full name?</p>
          <input type="text"
            value={this.state.nameFormVal}
            onChange={this.handleNameChange}
          />
          <input type="submit" value="Submit" />
      </form>
    );

    let residentQ = (
      <div>
        <p className="f4">3. Are you a U.S. Citizen or permanent resident?</p>
        <label className="mr2">Yes.</label>
        <input className="ph2 " onClick={this.handleIsResident.bind(this)} type="checkbox" />
      </div>
    );

    let zipQ = (
      <form onSubmit={this.handleZipSubmit}>
        <p className="f4">4. What’s your ZIP code?</p>
        <input type="text"
          value={this.state.ZipFormVal}
          onChange={this.handleZipChange}
        />
        <input type="submit" value="Submit" />
      </form>
    );

    let codeQ = (
      <div>
        <p className="f4">5. Do you agree to abide by our code of conduct?</p>
        <p>It’s short: be decent, i.e., kind, respectful, sincere, and neighborly.</p>
        <label className="mr2">Yes.</label>
        <input className="ph2" onClick={this.handleAgreedCode.bind(this)} type="checkbox" />
      </div>
    );

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

    if (!this.props.isQualified && formMarkup) {
      return (
        <div className="w-50 center">
          <p>First, we need to make sure of a few things...</p>
          {formMarkup}
        </div>
      )
    }
    else
      return null;
  }
}
