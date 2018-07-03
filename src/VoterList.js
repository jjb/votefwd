// src/VoterList.js

import React, { Component } from 'react';
import axios from 'axios';
import ReactMoment from 'react-moment';
import moment from 'moment';
import download from 'js-file-download';

class VoterRecord extends Component {
  constructor(props) {
    super(props)

    this.state = { signedUrl: ''}
    this.getSignedUrl = this.getSignedUrl.bind(this);
  }

  getSignedUrl(rawUrl) {
    axios({
      headers: {Authorization: 'Bearer '.concat(localStorage.getItem('access_token'))},
      method: 'GET',
      url: `${process.env.REACT_APP_API_URL}/voter/signed-letter-url`,
      params: { url: rawUrl }
    })
    .then(res => {
      this.setState({ signedUrl: res.data });
    })
    .catch(err => {
      console.error(err);
    });
  }

  componentWillMount() {
    // This is a kludge, a lame way of checking whether the url is signed
    // yet. On initial adoption, it comes back already signed, but on
    // subsequent page loads, it does not currently, so, check.
    // TODO: change `getAdoptedVotersForUser` in voter service
    // to always send back signed Urls.
    if ( !this.props.voter.plea_letter_url ) {
      return;
    }
    else if (this.props.voter.plea_letter_url.length > 150) {
      this.setState({ signedUrl: this.props.voter.plea_letter_url })
    }
    else {
      this.getSignedUrl(this.props.voter.plea_letter_url);
    }
  }

  render() {
    let voter = this.props.voter;
    let filename = "VoteForward_PleaLetter_" + voter.last_name + '.pdf';
    let voterDisplay;

    let today = moment();
    let electionDate = moment('2018-08-07');
    let sendDate = electionDate.subtract(8, "days");
    let readyToSend;
    today < sendDate ? readyToSend = false : readyToSend = true;

    if (!voter.confirmed_prepped_at) {
      voterDisplay = (
        <div>
          <div>
            <a className="btn btn-secondary btn-sm mr-2"
              download={filename}
              href={this.state.signedUrl}>
                Download
            </a>
          <button className="btn btn-success btn-sm" onClick={() => {this.props.confirmPrepped(voter)}}>Ready</button>
          </div>
        </div>
      )
    }
    else if (voter.confirmed_prepped_at && !voter.confirmed_sent_at) {
      voterDisplay = (
        <div className="text-success small mt-2">
          <span>Ready:</span> <ReactMoment format="M/DD/YY">{voter.confirmed_prepped_at}</ReactMoment>
          <br/>
          <span>Send on:</span> <ReactMoment format="M/DD/YY">{sendDate}</ReactMoment>
          <button disabled={!readyToSend} className="btn btn-success btn-sm" onClick={() => {this.props.confirmSent(voter)}}>Sent</button>
        </div>
      )
    }
    else {
      voterDisplay = (
        <div className="text-success small mt-2">
          <span>Confirmed sent:</span> <ReactMoment format="M/DD/YY">{voter.confirmed_sent_at}</ReactMoment>
        </div>
      )
    }

    return (
      <li className="list-group-item" key={voter.id}>
        <div className="d-flex w-100 mb-1">
          <h6>{voter.first_name} {voter.last_name} <small>in {voter.city}, {voter.state}</small></h6>
          {voterDisplay}
        </div>
      </li>
    )
  }
}

export class VoterList extends Component {
  constructor(props) {
    super(props)

    this.downloadBundle = this.downloadBundle.bind(this);
    this.state= { downloadingBundle: false };
  }

  downloadBundle() {
    this.setState({downloadingBundle: true});
    axios({
     method: 'GET',
      headers: {Authorization: 'Bearer '.concat(localStorage.getItem('access_token'))},
      url: `${process.env.REACT_APP_API_URL}/voters/downloadAllLetters`,
      params: { user_id: localStorage.getItem('user_id')},
      responseType: "blob"
    })
    .then(res => {
      download(res.data, res.headers.filename);
      this.setState({downloadingBundle: false});
    })
    .catch(err => {
      console.error(err);
    });
  }

  render() {
    let toPrep = this.props.voters.filter(voter => !voter.confirmed_prepped_at);
    let toSend = this.props.voters.filter(voter => voter.confirmed_prepped_at && !voter.confirmed_sent_at);
    let alreadySent = this.props.voters.filter(voter => voter.confirmed_sent_at);
    let alertContent;
    if (this.state.downloadingBundle) {
      alertContent = (
        <div className="alert alert-warning mt-3 mb-3 center" role="alert">Preparing batch to download...this may take a minute.</div>
      );
    }
    return (
      <div className="row">
        <div className="col mr-2">
          <div className="row">
            <div className="col">
              <h4>Letters to Prep: {toPrep.length}</h4>
            </div>
            <div className="col text-right">
              <div className="btn-group" role="group">
                {toPrep.length > 1 &&
                <div>
                  <button disabled={this.state.downloadingBundle ? true : false} className="btn btn-secondary btn-sm" onClick={this.downloadBundle}>
                    Download all
                  </button>
                </div>
                }
              </div>
            </div>
            {alertContent}
          </div>
          <ul className="list-group">
            {toPrep.map(voter =>
              <VoterRecord
                key={voter.id}
                voter={voter}
                confirmPrepped={this.props.confirmPrepped}
              />)}
          </ul>
        </div>
        <div className="col">
          <h4>Letters Prepared: {toSend.length}</h4>
          <p className="alert alert-danger">Don‘t mail these yet! For maximum impact, send them 7 days before the election, on <strong>Tuesday, July 31</strong>.</p>
          <ul className="list-group">
            {toSend.map(voter =>
              <VoterRecord
                key={voter.id}
                voter={voter}
                confirmSent={this.props.confirmSent}
              />)}
          </ul>
        </div>
        <div className="col">
          <h4>Sent Letters: {alreadySent.length}</h4>
            {alreadySent.map(voter =>
              <VoterRecord
                key={voter.id}
                voter={voter}
              />)}
        </div>
      </div>
    );
  }
}
