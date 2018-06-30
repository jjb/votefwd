// src/VoterList.js

import React, { Component } from 'react';
import axios from 'axios';
import Moment from 'react-moment';
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
    return (
      <li className="list-group-item" key={voter.id}>
        <div className="d-flex w-100 mb-1">
          <h6>{voter.first_name} {voter.last_name} <small>in {voter.city}, {voter.state}</small></h6>
        </div>
      { voter.confirmed_sent_at ? (
        <div className="text-success small mt-2">
          <span>Confirmed ready:</span> <Moment format="M/DD/YY">{voter.confirmed_sent_at}</Moment>
        </div>
      ) : (
        <div>
          <a className="btn btn-secondary btn-sm mr-2"
            download={filename}
            href={this.state.signedUrl}>
              Download
          </a>
        <button className="btn btn-success btn-sm" onClick={() => {this.props.confirmSend(voter)}}>Ready!</button>
        </div>
      )}
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
    let alreadySent = this.props.voters.filter(voter => voter.confirmed_sent_at);
    let toSend = this.props.voters.filter(voter => !voter.confirmed_sent_at);
    let alertContent;
    if (this.state.downloadingBundle) {
      alertContent = (
        <div className="alert alert-warning mt-3 mb-3 center" role="alert">Preparing batch to download...this may take a minute.</div>
      );
    }
    return (
      <div className="row">
        <div className="col mr-5">
          <div className="row">
            <div className="col">
              <h4>{toSend.length} Letters to Prep</h4>
            </div>
            <div className="col text-right">
              <div className="btn-group" role="group">
                {toSend.length > 1 &&
                <div>
                  <button className="btn btn-secondary btn-sm" onClick={this.downloadBundle}>
                    Download all
                  </button>
                  <button className="btn btn-secondary btn-sm" onClick={() => {console.log("This button will mark all the outstanding letters as ready to send.")}}>Mark all ready</button>
                </div>
                }
              </div>
            </div>
            {alertContent}
          </div>
          <ul className="list-group">
            {toSend.map(voter =>
              <VoterRecord
                key={voter.id}
                voter={voter}
                confirmSend={this.props.confirmSend}
              />)}
          </ul>
        </div>
        <div className="col">
          <h4>{alreadySent.length} Letters Prepared & Ready to Send</h4>
          <ul className="list-group">
            {alreadySent.map(voter =>
              <VoterRecord
                key={voter.id}
                voter={voter}
              />)}
          </ul>
        </div>
      </div>
    );
  }
}
