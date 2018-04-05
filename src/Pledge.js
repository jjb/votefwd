// src/Pledge.js

import React, { Component } from 'react';
import axios from 'axios';
import { Header } from './Header';

class PledgeForm extends Component {
  constructor(props) {
    super(props);
    this.state = {value: '', pledgeError: false};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    axios({
      method: 'POST',
      url: `${process.env.REACT_APP_API_URL}/voter/pledge`,
      data: { code: this.state.value }
    })
    .then(res => {
      if (res.data === 0) {
        this.setState( {pledgeError: true});
      }
      else {
        this.props.handlePledge();
      }
    })
    .catch(err => {
      console.error(err);
    });
  }

  render() {
    return (
      <div className="tc">
        <form className="center db ma2" onSubmit={this.handleSubmit}>
          <label>
            Enter your voter pledge code here:
            <input className="center db ma2" type="text" value={this.state.value} onChange={this.handleChange} />
          </label>
          <input className="center db ma2" type="submit" value="Pledge to be a voter." />
        </form>
      { this.state.pledgeError &&
        <p>We didn't recognize that code. Try again.</p>
      }
      </div>
    )
  }
}

class PledgeThanks extends Component {
  render() {
    return (
        <div>
          <p>You just pledged to be a voter in the mid-term election on Tuesday, November 6, 2018. Thank you!</p>
          <a href="https://twitter.com" className="link underline blue hover-orange">Share your pledge on Twitter.</a>
          <a href="https://facebook.com" className="pl2 link underline blue hover-orange">Share your pledge on Facebook.</a>
          <p>Do you want to send letters like the one you received to others to encourage *them* to vote?</p>
          <a href="/dashboard" className="pl2 link underline blue hover-orange">Send letters</a>
        </div>
    );
  }
}

class Pledge extends Component {
  constructor(props) {
    super(props);
    this.state = {pledgeStatus: false};

    this.handlePledge = this.handlePledge.bind(this);
  }

  handlePledge() {
    this.setState({ pledgeStatus: true });
  }

  render() {
    return (
      <div>
        <Header auth={this.props.auth}/>
        { !this.state.pledgeStatus ?
          (
            <PledgeForm handlePledge={this.handlePledge.bind(this)}/>
          ) : (
            <PledgeThanks />
          )
        }
      </div>
    );
  }
}

export default Pledge
