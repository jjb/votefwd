// src/VoterList.js

import React, { Component } from 'react';
import axios from 'axios';

export class VoterList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      voters: []
    }
  }

  getVoters() {
    axios.get(`${process.env.REACT_APP_API_URL}/voters`)
      .then(res => {
        let voters = res.data;
        this.setState( {voters: voters} );
      })
      .catch(err => {
        console.error(err)
      });
  }

  componentWillMount(){
    this.getVoters()
  }

  render() {
    return (
      <div>
        <h2 className="title tc">Your adopted voters</h2>
        <ul className="list pl0 mt0 measure center">
        {this.state.voters.map(voter =>
          <li className="flex items-center lh-copy pa3 ph0-l bb b--black-10" key={voter.id}>
            <img className="w2 h2 w3-ns h3-ns br-100"
              src="http://tachyons.io/img/avatar_1.jpg"
              alt="voter avatar"
            />
            <div className="pl3 flex-auto">
              <span className="f6 db black-70">{voter.first_name} {voter.last_name}</span>
              <span className="f6 db black-70">Medium Hexagon, LLC</span>
            </div>
            <div>
              <a href="address:" className="f6 link blue hover-dark-gray">{voter.state}</a>
            </div>
          </li>
        )}
        </ul>
      </div>
    );
  }
}
