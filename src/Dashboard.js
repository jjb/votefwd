// src/Dashboard.js

import React, { Component } from 'react';
import { VoterList } from './VoterList';

class Dashboard extends Component {
  render() {
    return (
      <VoterList url="http://localhost:3001/api"/>
    );
  }
}

export default Dashboard
