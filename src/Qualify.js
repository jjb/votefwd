// src/Qualify.js

import React, { Component } from 'react';
import { RecaptchaComponent } from './Recaptcha';
import { ProgressIndicator } from './ProgressIndicator';
import axios from 'axios';

export class Qualify extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isHuman: false,
      pledgedVote: false,
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

  handlePledgedVote() {
    this.updateUser('pledgedVote', true);
    this.setState({ pledgedVote: true });
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
        pledgedVote: user.pledged_vote_at,
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
        pledgedVote: user.pledged_vote_at,
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
        <p>Are you a robot?</p>
        <div className="mb-3">
          <RecaptchaComponent handleSuccess={this.handleCaptcha.bind(this)}/>
        </div>
        <ProgressIndicator current={1} max={6}></ProgressIndicator>
      </div>
    );

    let pledgeQ = (
      <div>
        <p>Do you pledge to vote in every election?</p>
        <p>The letters you send to unlikely voters will mention your commitment to voting, urging the recipient to follow your example.</p>
        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            onClick={this.handlePledgedVote.bind(this)} />
          <label className="form-check-label">
            Yes
          </label>
        </div>
        <ProgressIndicator current={2} max={6}></ProgressIndicator>
      </div>
    );

    let nameQ = (
      <form onSubmit={this.handleNameSubmit}>
        <p>What’s your full name?</p>
        <div className="input-group mb-3">
          <input type="text"
            className="form-control"
            placeholder="First and last name"
            value={this.state.nameFormVal}
            onChange={this.handleNameChange} />
          <div className="input-group-append">
            <button className="btn btn-outline-secondary" type="submit">Submit</button>
          </div>
        </div>
        <ProgressIndicator current={3} max={6}></ProgressIndicator>
      </form>
    );

    let residentQ = (
      <div>
        <p>Are you a U.S. Citizen or permanent resident?</p>
        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            onClick={this.handleIsResident.bind(this)} />
          <label className="form-check-label">
            Yes
          </label>
        </div>
        <ProgressIndicator current={4} max={6}></ProgressIndicator>
      </div>
    );

    let zipQ = (
      <form onSubmit={this.handleZipSubmit}>
        <p>What’s your ZIP code?</p>
        <div className="input-group mb-3">
          <input type="text"
            className="form-control"
            placeholder="00000"
            value={this.state.ZipFormVal}
            onChange={this.handleZipChange} />
          <div className="input-group-append">
            <button className="btn btn-outline-secondary" type="submit">Submit</button>
          </div>
        </div>
        <ProgressIndicator current={5} max={6}></ProgressIndicator>
      </form>
    );

    let codeQ = (
      <div>
        <p className="f4">Do you promise to be respectful at all times in your communications with fellow citizens through Vote Forward?</p>
        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            onClick={this.handleAgreedCode.bind(this)} />
          <label className="form-check-label">
            Yes
          </label>
        </div>
        <ProgressIndicator current={6} max={6}></ProgressIndicator>
      </div>
    );

    if (!this.state.isHuman) {
      formMarkup = captchaQ;
    }
    else if (!this.state.pledgedVote) {
      formMarkup = pledgeQ;
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
        <div>
          <div className="modal" tabIndex="-1" role="dialog" style={{display: 'block'}}>
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    First, we need to make sure of a few things...
                  </h5>
                </div>
                <div className="modal-body">
                  {formMarkup}
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop"
            style={{
              opacity: 0.9,
              backgroundColor: 'white'
            }}></div>
        </div>
      )
    }
    else
      return null;
  }
}
