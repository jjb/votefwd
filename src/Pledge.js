// src/Pledge.js

import React, { Component } from 'react';
import axios from 'axios';
import { Header } from './Header';
import { Footer } from './Footer';

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
      <div className="w-50 mx-auto my-5">
      <div className="form-group">
        <label for="hashid" className="control-label">Enter the code from your letter to pledge that you will vote:</label>
        <input
          id="hashid"
          type="text"
          className="form-control"
          placeholder="A1B2C3"
          value={this.state.value}
          onChange={this.handleChange} />
      </div>
      <div className="form-group">
        <button className="btn btn-primary" type="submit">Pledge to be a voter.</button>
      </div>
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
        <div className="text-center">
          <p>You just pledged to be a voter in the special election on Tuesday, August 7, 2018. Thank you!</p>
          <a href={"https://twitter.com/intent/tweet?text=" + encodedTweetIntentText} target="blank" className="link">Share your pledge on Twitter.</a>
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
        <Footer />
      </div>
    );
  }
}

export default Pledge
