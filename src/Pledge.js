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
        <p>We didn’t recognize that code. Please try again!</p>
      }
      </div>
    )
  }
}

class PledgeThanks extends Component {
  render() {
    let tweetIntentText = "A fellow citizen sent me a letter asking me to be a voter, so I’m pledging to vote this year.\n\nWant to help elect Democrats to Congress? Visit www.votefwd.org to send ‘please vote’ letters of your own. @votefwd"
    let encodedTweetIntentText = encodeURIComponent(tweetIntentText);
    return (
        <div className="tc">
          <p>You just pledged to be a voter in the special election on Tuesday, August 7, 2018. Thank you!</p>
          <a href={"https://twitter.com/intent/tweet?text=" + encodedTweetIntentText} target="blank" className="link underline blue hover-orange">Share your pledge on Twitter.</a>
          <p>Want to send letters like the one you received to encourage others to vote?</p>
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
