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
      headers: {Authorization: 'Bearer '.concat(localStorage.getItem('access_token'))},
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
        <p className="tc w-50 center">Once you adopt a voter, that voter is yours, and will not be assigned to anyone else.</p>
        <p>That means that, by adopting a voter, you’re committing to sending a letter. We’re counting on you!</p>
        <button onClick={() => this.adoptVoter(1)}>1</button>
        <button onClick={() => this.adoptVoter(5)}>5</button>
        <button onClick={() => this.adoptVoter(15)}>15</button>
        {content}
      </div>
    )
  }
}
