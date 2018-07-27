 //src/Qualify.js

import React, { Component } from 'react';
import { RecaptchaComponent } from './Recaptcha';
import { ProgressIndicator } from './ProgressIndicator';
import axios from 'axios';

export class Qualify extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
        this.props.updateUser('is_human_at', true);
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
    this.props.updateUser('full_name', this.state.nameFormVal);
    event.preventDefault();
  }

  handleZipChange(event) {
    this.setState({ zipFormVal: event.target.value });
  }

  handleZipSubmit(event) {
    this.props.updateUser('zip', this.state.zipFormVal);
    event.preventDefault();
  }

  handlePledgedVote() {
    this.props.updateUser('pledged_vote_at', true);
  }

  handleIsResident() {
    this.props.updateUser('is_resident_at', true);
  }

  handleAgreedCode() {
    this.props.updateUser('accepted_code_at', true);
  }

  handleAgreedProfile() {
    this.props.updateUser('profile', true);
  }

  render() {

    let formMarkup;

    let captchaQ = (
      <div className="px-4 pt-2">
        <p>
          We're so excited you're getting involved! We have a few quick questions before you get started…
        </p>
        <h4>Are you a robot?</h4>
        <div className="mb-3">
          <RecaptchaComponent handleCaptchaResponse={this.handleCaptcha.bind(this)}/>
        </div>
      </div>
    );

    let pledgeQ = (
      <div>
        <div className="px-4 pt-2">
          <p>Do you pledge to vote in every election?</p>
          <button className="btn btn-primary w-100" onClick={this.handlePledgedVote.bind(this)}>Yes</button>
          <p className="small my-3">
            The letters you send will mention <strong>your</strong> commitment to voting, urging the recipient to follow your example.
          </p>
        </div>
        <ProgressIndicator current={1} max={7}></ProgressIndicator>
      </div>
    );

    let nameQ = (
      <form onSubmit={this.handleNameSubmit}>
        <div className="px-4 pt-2">
          <p>What’s your full name?</p>
          <div className="input-group mb-3">
            <input type="text"
              className="form-control"
              placeholder="First and last name"
              value={this.state.nameFormVal}
              onChange={this.handleNameChange} />
            <button className="btn btn-primary" type="submit">Submit</button>
          </div>
        </div>
        <ProgressIndicator current={2} max={7}></ProgressIndicator>
      </form>
    );

    let residentQ = (
      <div>
        <div className="px-4 pt-2">
          <p>Are you a U.S. citizen or permanent resident?</p>
          <button className="btn btn-primary w-100" onClick={this.handleIsResident.bind(this)}>Yes</button>
          <p className="small my-3">In general, one must be a citizen or permanent resident to participate in election activities. There’s an exception for volunteering, but we’re erring on the side of caution.</p>
        </div>
        <ProgressIndicator current={3} max={7}></ProgressIndicator>
      </div>
    );

    let zipQ = (
      <form onSubmit={this.handleZipSubmit}>
        <div className="px-4 pt-2">
          <p>What’s your ZIP code?</p>
          <div className="input-group mb-3">
            <input type="text"
              className="form-control"
              placeholder="00000"
              value={this.state.ZipFormVal}
              onChange={this.handleZipChange} />
            <button className="btn btn-primary" type="submit">Submit</button>
          </div>
        </div>
        <ProgressIndicator current={4} max={7}></ProgressIndicator>
      </form>
    );

    let codeQ = (
      <div>
        <div className="px-4 pt-2">
          <p className="f4">
            Do you agree to the <a href="/terms-of-use" target="_blank">Terms of Use</a> and <a href="privacy-policy" target="_blank">Privacy Policy</a>, and specifically, do you promise to be respectful at all times in your communications with fellow citizens via Vote Forward?
          </p>
          <button className="btn btn-primary w-100" onClick={this.handleAgreedCode.bind(this)}>Yes</button>
        </div>
        <ProgressIndicator current={5} max={7}></ProgressIndicator>
      </div>
    );

    let profileQ = (
      <div>
        <div className="px-4 pt-2">
          <p className="f4">
            Scott is a meat popsicle
          </p>
        </div>
        <ProgressIndicator current={6} max={7}></ProgressIndicator>
      </div>
    );

    if (!this.props.user.is_human_at) {
      formMarkup = captchaQ;
    }
    else if (!this.props.user.pledged_vote_at) {
      formMarkup = pledgeQ;
    }
    else if (!this.props.user.full_name) {
      formMarkup = nameQ;
    }
    else if (!this.props.user.is_resident_at) {
      formMarkup = residentQ;
    }
    else if (!this.props.user.zip) {
      formMarkup = zipQ;
    }
    else if (!this.props.user.accepted_code_at) {
      formMarkup = codeQ;
    }
    else if (!this.props.user.profile) {
      formMarkup = profileQ;
    }
    else {
      formMarkup = null;
    }

    if (!this.props.isQualified && formMarkup) {
      return (
        <div>
          { this.props.auth.isAuthenticated() && (
            <React.Fragment>{formMarkup}</React.Fragment>
          )}
        </div>
      )
    }
    else
      return null;
  }
}
