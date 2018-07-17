// src/AdoptVoter.js

import React, { Component } from 'react';
import axios from 'axios';
import loading from './loading.svg';

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
        <div
          className="alert alert-success alert-progress pl-5"
          role="alert">
          <img src={loading} alt="loading" className="ml-5 mr-3" /> Assigning 5 voters to you. This may take a moment.
        </div>
      )
    } else {
      content = (
        <button
          disabled={this.state.adopting ? true : false}
          onClick={() => this.adoptVoter(5)}
          className="btn btn-primary btn-lg w-100">
            Adopt <span className="reset-num">5</span> Voters
        </button>
      )
    }
    return (
      <div className="container-fluid p-0">
        <div className="row no-gutters position-relative">
          <div className="col-12 fixed-top position-absolute">
          </div>
          <div className="col-lg-6 order-lg-2 dashboard--call-to-action px-3 py-4" />
          <div className="col-lg-6 order-lg-1 showcase-text bg-light p-5">
            <div className="p-2 p-5-m">
              <h1>Send Letters to Ohio Voters</h1>
              <p className="u-highlight mb-3">
                Special election for U.S. House of Representatives
                <br />Ohio’s 12th District, Tuesday, August 7, 2018
                <br />Target: Democrats who voted in ‘12 & ‘16 <strong>but not ‘14</strong>
              </p>
              <p className="mb-3">
                <span className="small">Return address:</span>
                <br />Your first name & last initial
                <br />829 Bethel Road #137
                <br />Columbus, OH 43214
              </p>
              <p className="mt-4 mb-3 small">
                Voters you adopt won‘t be assigned to anyone else, so by adopting them, you’re committing to send the letters.
              </p>
              {content}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
