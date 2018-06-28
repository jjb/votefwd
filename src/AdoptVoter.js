// src/AdoptVoter.js

import React, { Component } from 'react';
import axios from 'axios';

export class AdoptVoter extends Component {
  constructor(props) {
    super(props);

    this.adoptVoter = this.adoptVoter.bind(this);
    this.state = { adopting: false };
  }

  adoptVoter() {
    var numVoters = 1; //TODO: figure out how to get picker on dashboard.js
    this.setState({adopting: true});
    let user_id = localStorage.getItem('user_id');
    axios({
      method: 'POST',
      url: `${process.env.REACT_APP_API_URL}/voter/adopt-random`,
      data: {
          adopterId: user_id,
          numVoters: numVoters
        }
      })
      .then(res => {
        this.props.handleAdoptedVoter(res.data.voters);
        this.setState({adopting: false});
      })
      .catch(err => {
        console.error(err);
    })
  }

  render() {
    let content;
    if (this.state.adopting) {
      content = (
        <p className="f4 red">Finding a voter for you to adopt...</p>
      )
    }
    return (
      <div>
        <button onClick={() => this.adoptVoter()}>Adopt a Voter</button>
        <p className="tc w-50 center">Voters you adopt will not be assigned to anyone else!</p>
        <p>Please proceed only if you’re committed to sending a letter.</p>
        {content}
      </div>
    )
  }
}
