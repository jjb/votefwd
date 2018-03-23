// src/VoterList.js

import React, { Component } from 'react';
import Avatar from 'react-avatar';

class VoterRecord extends Component {
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
          target="_blank"
          download={filename}
          href={voter.plea_letter_url}>
            Download letter
        </a>
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
          {this.props.voters.map(voter => <VoterRecord key={voter.id} voter={voter} />)}
        </ul>
      </div>
    );
  }
}
