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
        <div className="alert alert-warning mt-3 mb-0" role="alert">Assigning voters to you...this may take a minute.</div>
      )
    }
    return (
      <div className="jumbotron">
        <h1>Adopt Voters</h1>
        <hr className="my-4" />
        <p>Click the button for the number of voters you’d like to adopt. We’ll generate letters for each one that you can download and print.</p>
        <p>Voters you adopt are yours exclusively. They won’t be assigned to anyone else. By adopting a voter, you’re committing to sending a letter. We’re counting on you!</p>
        <button onClick={() => this.adoptVoter(1)} className="btn btn-primary btn-lg">1</button>
        <button onClick={() => this.adoptVoter(5)} className="btn btn-primary btn-lg">5</button>
        <button onClick={() => this.adoptVoter(15)} className="btn btn-primary btn-lg">15</button>
        {content}
      </div>
    )
  }
}
