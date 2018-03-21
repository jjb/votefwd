// src/VoterList.js

import React, { Component } from 'react';
import axios from 'axios';
import Avatar from 'react-avatar';
import download from './download';

export class VoterList extends Component {
  constructor(props) {
    super(props);
    this.generatePDF = this.generatePDF.bind(this);
  }

  generatePDF(event) {
    event.preventDefault();
    axios.get(`${process.env.REACT_APP_API_URL}/voter/10/letter`)
      .then(res => {
        console.log(res);
        //download(res.data, 'voter_letter.pdf', 'application/pdf');
      })
      .catch(err => {
        console.error(err)
      });
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
            <form onSubmit={this.generatePDF}>
              <input type="submit" value="Download letter" />
            </form>
          </li>
        )}
        </ul>
      </div>
    );
  }
}
