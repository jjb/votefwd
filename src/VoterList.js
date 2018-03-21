// src/VoterList.js

import React, { Component } from 'react';
import Avatar from 'react-avatar';
import fs from 'fs';
import pdfkit from 'pdfkit'

export class VoterList extends Component {
  generatePDF() {
    console.log('hi');
    var doc = new pdfkit;
  }

  render() {
    return (
      <div>
        <h2 className="title tc">Your Voters</h2>
        <ul className="list pl0 mt0 measure center">
        {this.props.voters.map(voter =>
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
            <button onClick={this.generatePDF}>Download letter</button>
          </li>
        )}
        </ul>
      </div>
    );
  }
}
