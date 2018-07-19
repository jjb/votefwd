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
      <div className="bg-white px-3 px-md-5 py-3 py-md-4 align-self-center text-center">
        <form onSubmit={this.handleSubmit}>
          <label className="w-100">
            <h3 className="mb-4">
              Enter your voter pledge code here:
            </h3>
            <input className="form-control form-control-lg text-center mb-2 w-100" type="text" value={this.state.value} onChange={this.handleChange} />
          </label>
          <input className="btn btn-primary btn-lg w-100 " type="submit" value="Pledge to be a voter." />
        </form>
      { this.state.pledgeError &&
        <div className="alert alert-danger mt-3" role="alert">
          Sorry, we didn’t recognize that code. Please try again!
        </div>
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
        <div className="bg-white px-3 px-md-5 py-3 py-md-4 align-self-center">
          <p>
            You just pledged to be a voter in the special election on Tuesday, August 7, 2018. Thank you!
          </p>
          <p>
            <a
              href={"https://twitter.com/intent/tweet?text=" + encodedTweetIntentText}
              target="blank"
              className=""
            >
                Share your pledge on Twitter.
            </a>
          </p>
          <p>Want to send letters like the one you received to encourage others to vote?</p>
          <a
            href="/dashboard"
            className="pl2 link underline blue"
          >
            Send letters
          </a>
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
      <div className="h-100 d-md-flex flex-column">
      <Header auth={this.props.auth} />
      <div className="container-fluid h-75 bg-pattern d-flex justify-content-center">
        <div className="d-flex">
        { this.state.pledgeStatus ?
          (
            <PledgeForm handlePledge={this.handlePledge.bind(this)}/>
          ) : (
            <PledgeThanks />
          )
        }
        </div>
      </div>
      <Footer />
      </div>
    );
  }
}

export default Pledge
