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
    this.getVoterInfo = this.getVoterInfo.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }
  getVoterInfo(event) {
    event.preventDefault();
    axios({
      method: 'POST',
      url: `${process.env.REACT_APP_API_URL}/voter/info`,
      data: { code: this.state.value }
    })
    .then(res => {
      this.props.handleVoterInfo({
        urlElectionInfo: res.data.urlElectionInfo,
        voterState: res.data.voterState,
        shouldRecordPledge: res.data.shouldRecordPledge,
        code: this.state.value,
        codeSubmitted: true
      });
    })
    .catch(err => {
      this.setState({ pledgeError: true });
      console.error(err);
    });
  }

  render() {
    return (
      <div className="bg-white px-3 px-md-5 py-3 py-md-4 align-self-center text-center">
        <form onSubmit={this.getVoterInfo}>
          <label className="w-100">
            <p className="lead">
              Welcome, fellow citizen! 
              Check out the the letter you received.  See how it has a code like this at the bottom?...
            </p>
            <img src="/images/letter-code-sample.png" className="w-100" alt=""/>
            <p className="mb-3">
              For more info about the election, enter the code from <i>your</i> letter here...
            </p>
            <input className="form-control form-control-lg text-center mb-2 w-100" type="text" value={this.state.value} onChange={this.handleChange} />
          </label>
          <input className="btn btn-primary btn-lg w-100 " type="submit" value="Submit" />
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
class PledgeInfo extends Component {
  constructor(props) {
    super(props);
    this.handleVotePledge = this.handleVotePledge.bind(this);
  }
  handleVotePledge(event) {
    event.preventDefault();
    axios({
      method: 'POST',
      url: `${process.env.REACT_APP_API_URL}/voter/pledge`,
      data: { code: this.props.code }
    })
    .then(res => {
      this.props.handlePledgeThanks();
    })
    .catch(err => {
      // No matter what happens on the server, show the user the "Thanks" message
      this.props.handlePledgeThanks();
      console.error(err);
    });
  }
 
  render() {
    return (
        <div className="bg-white px-3 px-md-5 py-3 py-md-4 align-self-center">
          <form onSubmit={this.handleVotePledge}>
            <p>
              Congratulations! We found your record which shows you are registered to vote in {this.props.voterState}.
            </p>
            <p>
              Click below to open the official {this.props.voterState} election site where you can find your polling location and other relevant information.
            </p>
            <a
                href={this.props.urlElectionInfo}
                target="_blank"
                className="btn btn-info btn-lg w-100"
              >Find Election Info
              </a>
              <div>
                <p>
                  Will you be voting in the election?
                </p>
                <input className="btn btn-primary btn-lg w-100 " type="submit" value="Yes, I'll be Voting!" />
                <p><i>If you say yes, we will anonymously inform the sender of the letter you were sent that one of their sendees pledged to vote.</i></p>
                { !this.props.shouldRecordPledge && (
                  <p><i>Note: this page is currently running in sample mode, so the pledge won't actually be recorded when pressing the "Yes, I'll be Voting" button.  Once letters are mailed closer to election day, the page will switch to active mode.</i></p>
                ) }
              </div>
          </form>
        </div>
    );
  }
}
class PledgeThanks extends Component {
  render() {
    let tweetIntentText = "A fellow citizen sent me a letter asking me to be a voter, so I’m pledging to vote this year. Want to encourage voter participation? Visit www.votefwd.org to send letters of your own. @votefwd"
    let encodedTweetIntentText = encodeURIComponent(tweetIntentText);
    return (
        <div className="bg-white px-3 px-md-5 py-3 py-md-4 align-self-center">
          <h1>Thank you!</h1>
          <p>
            You just pledged to be a voter in the midterm election on <strong>Tuesday, November 6, 2018</strong>.
          </p>
          <p>
            <a
              href={"https://twitter.com/intent/tweet?text=" + encodedTweetIntentText}
              target="blank"
              className=""
            >
                Share your pledge on Twitter.
            </a>
          </p><p>
            <a
              href={this.props.urlElectionInfo}
              target="_blank"
              className="btn btn-info btn-lg w-100"
            >Find Election Info
            </a>
          </p>
        </div>
    );
  }
}

class Pledge extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pledgeStatus: '', //possible values '' and 'thanks'
      voterState: '',
      code: '',
      shouldRecordPledge: true,
      urlElectionInfo: ''
    };

    this.handlePledgeThanks = this.handlePledgeThanks.bind(this);
  }
  handlePledgeThanks() {
    this.setState({ pledgeStatus: 'thanks' });
  }
  handleVoterInfo(payload) {
    this.setState(payload);
  }

  render() {
    return (
      <div className="h-200 d-md-flex flex-column">
      <Header auth={this.props.auth} />
      <div className="container-fluid h-75 bg-pattern d-flex justify-content-center">
        <div className="d-flex">
        { !this.state.codeSubmitted &&
          (
            <PledgeForm handleVoterInfo={this.handleVoterInfo.bind(this)}/>
          )
        }
        { this.state.codeSubmitted && this.state.pledgeStatus !== 'thanks' &&
          (
            <PledgeInfo 
              handlePledgeThanks={this.handlePledgeThanks.bind(this)}
              pledgeStatus={this.state.pledgeStatus}
              voterState={this.state.voterState}
              code={this.state.code}
              shouldRecordPledge={this.state.shouldRecordPledge}
              urlElectionInfo={this.state.urlElectionInfo}
            />
          )
        }
        {this.state.pledgeStatus === 'thanks' && (
            <PledgeThanks
              voterState={this.state.voterState}
              urlElectionInfo={this.state.urlElectionInfo}
            />
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
