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
      <div className="pa2">
        <h2 className="title tc">Your adopted voters</h2>
        {this.state.voters.map(voter => <div className="ml5 h3 ba mt2" key={voter.id}> {voter.id} {voter.name} </div>)}
      </div>
    );
  }
}

