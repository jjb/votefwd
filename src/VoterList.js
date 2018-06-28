// src/VoterList.js

import React, { Component } from 'react';
import axios from 'axios';
import Moment from 'react-moment';

class VoterRecord extends Component {
  constructor(props) {
    super(props)

    this.state = { signedUrl: ''}
    this.getSignedUrl = this.getSignedUrl.bind(this);
  }

  getSignedUrl(rawUrl) {
    axios({
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
      <li className="flex items-center lh-copy ph0-l bb b--black-10" key={voter.id}>
        <div className="pl4 flex-auto">
          <span className="tl f6 db black-70">
            {voter.first_name} {voter.last_name} in {voter.city}, {voter.state}
          </span>
        </div>
        <a className="f6 link dim ph3 pv2 mb2 dib black-70"
          download={filename}
          href={this.state.signedUrl}>
            Download 
        </a>
      { voter.confirmed_sent_at ? (
        <div className="pa2">
          <span>Confirmed ready:</span> <Moment format="M/DD/YY">{voter.confirmed_sent_at}</Moment>
        </div>
      ) : (
        <button className="f6 link dim ba ph3 pv2 mb2 dib black" onClick={() => {this.props.confirmSend(voter)}}>Ready!</button>
      )}
      </li>
    )
  }
}

export class VoterList extends Component {
  render() {
    let alreadySent = this.props.voters.filter(voter => voter.confirmed_sent_at);
    let toSend = this.props.voters.filter(voter => !voter.confirmed_sent_at);
    return (
      <div>
        <h2 className="title tc">Letters to Prep</h2>
          <ul className="list pl0 mt0 w-60-ns w-90 center">
            {toSend.map(voter =>
              <VoterRecord
                key={voter.id}
                voter={voter}
                confirmSend={this.props.confirmSend}
              />)}
          </ul>
        <h2 className="title tc">Letters Ready to Send</h2>
          <ul className="list pl0 mt0 w-60-ns w-90 center">
            {alreadySent.map(voter =>
              <VoterRecord
                key={voter.id}
                voter={voter}
              />)}
          </ul>
      </div>
    );
  }
}
