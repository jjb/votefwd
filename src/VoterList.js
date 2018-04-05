// src/VoterList.js

import React, { Component } from 'react';
import axios from 'axios';
import Avatar from 'react-avatar';
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
    if (this.props.voter.plea_letter_url.length > 150) {
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
      <li className="flex items-center lh-copy pa3 ph0-l bb b--black-10" key={voter.id}>
        <Avatar size={50} round={true} name={voter.first_name + ' ' + voter.last_name}/>
        <div className="pl4 flex-auto">
          <span className="tl f6 db black-70">{voter.first_name} {voter.last_name}
            <br/>
            {voter.address}
            <br/>
            {voter.city}, {voter.state} {voter.zip}
          </span>
        </div>
        <a className="link"
          download={filename}
          href={this.state.signedUrl}>
            Download letter
        </a>
      { voter.confirmed_sent_at ? (
        <div className="pa2">
          <span>Confirmed sent on:</span> <Moment format="M/DD/YYYY">{voter.confirmed_sent_at}</Moment>
        </div>
      ) : (
        <button className="pa2" onClick={() => {this.props.confirmSend(voter)}}>Confirm</button>
      )}
      </li>
    )
  }
}

export class VoterList extends Component {
  render() {
    return (
      <div>
        <h2 className="title tc">Your Voters</h2>
        <ul className="list pl0 mt0 measure center">
          {this.props.voters.map(voter => 
            <VoterRecord
              key={voter.id}
              voter={voter}
              confirmSend={this.props.confirmSend}
            />)}
        </ul>
      </div>
    );
  }
}
