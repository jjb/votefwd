// src/Dashboard.js

import React, { Component } from 'react';
import { VoterList } from './VoterList';
import { VoterOffer } from './VoterOffer';

class Dashboard extends Component {
  render() {
    return (
      <div className="tc">
        <VoterOffer />
        <VoterList />
      </div>
    );
  }
}

export default Dashboard
