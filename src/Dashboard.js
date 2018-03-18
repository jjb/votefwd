// src/Dashboard.js

import React, { Component } from 'react';
import axios from 'axios';
import { VoterList } from './VoterList';

class OfferedVoter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      offeredVoter: this.props.offeredVoter 
    }
  }

  render() {
    console.log(this.state);
    return (
      <div>
        <p>{this.state.offeredVoter.name}</p>
        <p>hi</p>
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
        <p>{this.state.offeredVoter.name}</p>
        <VoterList />
      </div>
    );
  }
}

export default Dashboard
