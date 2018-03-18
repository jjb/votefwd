// src/Dashboard.js

import React, { Component } from 'react';
import axios from 'axios';
import { VoterList } from './VoterList';

class OfferedVoter extends Component {
  render() {
    let voter = this.props.voter;
    return (
      <div>
        <p>{voter.first_name} {voter.last_name} from {voter.state}</p>
      </div>
    )
  }
}

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      offeredVoter: []
    }

    this.getVoter = this.getVoter.bind(this);
  }

  getVoter() {
    axios.get(`${process.env.REACT_APP_API_URL}/voters`)
      .then(res => {
        let voter = res.data[Math.floor(Math.random() * res.data.length)];
        this.setState( {offeredVoter: voter} );
      })
      .catch(err => {
        console.error(err)
      });
  }

  render() {
    return (
      <div>
        <button onClick={this.getVoter}>Adopt a voter</button>
        <OfferedVoter voter={this.state.offeredVoter} />
        <VoterList />
      </div>
    );
  }
}

export default Dashboard
