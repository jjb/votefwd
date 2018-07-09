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
        <div className="alert alert-warning mt-3 mb-0" role="alert">Assigning 5 voters to you. This may take a moment.</div>
      )
    }
    return (
      <div className="container-fluid p-0">
        <div className="row no-gutters">
          <div className="col-lg-6 order-lg-2 dashboard--call-to-action px-3 py-4">
            <br />
          </div>
          <div className="col-lg-6 order-lg-1 showcase-text bg-light p-5">
            <div className="p-5">
              <h1>Send Letters to Ohio Voters</h1>
              <p>Special election for U.S. House of Representatives | Ohio‘s 12th Congressional District | Tuesday, August 7, 2018</p>
              <hr className="my-4" />
              <p>
                We‘re writing letters to folks who voted in the last two presidential elections, but <strong>not in the 2014 midterm election</strong>
                — people who need extra encouragement to vote.
                Voters you "adopt" will not be assigned to anyone else. By adopting a voter, you’re committing to sending a letter. We’re counting on you!
              </p>
              <button
                disabled={this.state.adopting ? true : false}
                onClick={() => this.adoptVoter(5)}
                className="btn btn-primary btn-lg">
                  Adopt 5 Voters
              </button>
            </div>
          </div>
        </div>
        {content}
      </div>
    )
  }
}
