// src/AdoptVoter.js

import React, { Component } from 'react';
import axios from 'axios';

export class AdoptVoter extends Component {
  constructor(props) {
    super(props);

    this.adoptVoter = this.adoptVoter.bind(this);
    this.state = { adopting: false, district: {} };
  }

  adoptVoter(numVoters, district_id) {
    this.setState({adopting: true});
    let user_id = localStorage.getItem('user_id');
    axios({
      headers: {Authorization: 'Bearer '.concat(localStorage.getItem('access_token'))},
      method: 'POST',
      url: `${process.env.REACT_APP_API_URL}/voter/adopt-random`,
      data: {
          adopterId: user_id,
          numVoters: numVoters,
          districtId: district_id
        }
      })
      .then(res => {
        setTimeout(function() {
          this.props.handleAdoptedVoter(res.data.voters);
          this.setState({adopting: false});
        }.bind(this), 500);
      })
      .catch(err => {
        console.error(err);
    })
  }

  componentWillReceiveProps(props) {
    if (props.currentDistrict.district_id) {
      this.setState({ district: props.currentDistrict });
    }
  }

  render() {
    let maxedOut = false;
    if (this.props.user.qual_state === 'qualified' && this.props.voterCount >= 100) {
      maxedOut = true;
    }

    return (
      <div className="container-fluid p-0">
        <div className="row no-gutters position-relative">
          <div className="col-12 fixed-top position-absolute">
          </div>
          <div className="col-lg-6 order-lg-2 dashboard--call-to-action px-3 py-4" />
          <div className="col-lg-6 order-lg-1 showcase-text bg-light p-5">
            <div className="p-2 p-5-m">
              <h3>You’re helping flip <a href={'/district/' + this.state.district.district_id}><strong>{this.state.district.district_id}</strong></a> blue <button className="btn btn-link" onClick={this.props.toggleDistrictPicker}>Switch District</button></h3>
              <p className="u-highlight mb-3">
                {this.state.district.description}
              </p>
              <div className="mt-4 mb-3">
                  <p className="small">Voters you adopt won‘t be assigned to anyone else, so by adopting them, <strong>you’re committing to send the letters.</strong></p>
                  <p className="small">Instructions: You can <a href="https://storage.cloud.google.com/voteforward-production-static/vote-forward-instructions.pdf?_ga=2.37020132.-55278990.1513971056" target="_blank" rel="noopener noreferrer">download printable instructions</a>, or <a href="https://www.youtube.com/watch?v=UCPb-SFWYB4" target="_blank" rel="noopener noreferrer">watch a short video demo.</a></p>
              </div>
              <div className="row">
                <div className="col-md">
                  <button
                    disabled={this.state.adopting || maxedOut ? true : false}
                    onClick={() => this.adoptVoter(5, this.state.district.district_id)}
                    className="btn btn-primary btn-lg w-100 mt-1">
                      Adopt <span className="reset-num">5</span> Voters
                  </button>
                  <div className="small mt-1">
                    <i className="fa fa-clock-o"></i>
                    <span className="ml-1">5 letters: ~10 minutes to prepare</span>
                  </div>
                </div>
                <div className="col-md">
                  <button
                    disabled={this.state.adopting || maxedOut ? true : false}
                    onClick={() => this.adoptVoter(25, this.state.district.district_id)}
                    className="btn btn-primary btn-lg w-100 mt-1">
                      Adopt <span className="reset-num">25</span> Voters
                  </button>
                  <div className="small mt-1">
                    <i className="fa fa-clock-o"></i>
                    <span className="ml-1">25 letters: ~40 minutes to prepare</span>
                  </div>
                </div>
              </div>
              { maxedOut && (
                <div className="mt-4 alert alert-info pr-4 pl-4">
                  <p>You’ve adopted the maximum allowed number of voters. Fantastic! To become a super-volunteer so you can adopt more, please <a href="mailto:scott@votefwd.org?subject=Please+approve+me+as+a+super-volunteer!&body=Hello!+Please+approve+me+to+adopt+more+than+100+voters+on+Vote+Forward." target="_blank" rel="noopener noreferrer">email scott@votefwd.org</a> to request approval.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
