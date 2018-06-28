// src/AdoptVoter.js

import React, { Component } from 'react';
import axios from 'axios';

export class AdoptVoter extends Component {
  constructor(props) {
    super(props);

    this.adoptVoter = this.adoptVoter.bind(this);
    this.state = { adopting: false };
  }

  adoptVoter(numVoters) {
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
        <p className="f4 red">Assigning voters to you...this may take a minute.</p>
      )
    }
    return (
      <div>
        <h1 className="tc">Adopt Voters</h1>
        <p className="tc w-50 center">Click the button for the number of voters you’d like to adopt. We’ll generate letters for each one that you can download and print.</p>
        <p className="tc w-50 center">Voters you adopt are yours exclusively. They won’t be assigned to anyone else. By adopting a voter, you’re committing to sending a letter. We’re counting on you!</p>
        <button onClick={() => this.adoptVoter(1)}>1</button>
        <button onClick={() => this.adoptVoter(5)}>5</button>
        <button onClick={() => this.adoptVoter(15)}>15</button>
        {content}
      </div>
    )
  }
}
