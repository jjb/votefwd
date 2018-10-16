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
    let maxQual = parseInt(process.env.REACT_APP_QUAL_NUM || '100', 10);
    let maxedOut = false;
    if (this.props.user.qual_state === 'qualified' && this.props.voterCount >= maxQual)  {
      maxedOut = true;
    }
    let allClaimed = false;
    if (parseInt(this.props.currentDistrict.voters_available, 10) === 0) {
      allClaimed = true;
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
              <p className="u-highlight mb-3 d-none d-sm-block">
                {this.state.district.description}
              </p>
              <div className="mt-4 mb-3">
                  <p className="small">Voters you adopt won‘t be assigned to anyone else, so by adopting them, <strong>you’re committing to send the letters.</strong></p>
                  <p className="small">
                    <a href="/vote-forward-instructions.pdf" target="_blank" rel="noopener noreferrer">Printable Instructions</a> |
                    <a href="https://www.youtube.com/watch?v=UCPb-SFWYB4" className="ml-2" target="_blank" rel="noopener noreferrer">Video Demo</a> |
                    <a href="/vote-forward-party-kit.pdf" className="ml-2" target="_blank" rel="noopener noreferrer">Party Kit</a>
                  </p>
              </div>
              <div className="row">
                <div className="col-md">
                  <button
                    disabled={this.state.adopting || maxedOut || allClaimed ? true : false}
                    onClick={() => this.adoptVoter(5, this.state.district.district_id)}
                    className="btn btn-primary btn-lg w-100 mt-1">
                      Adopt <span className="reset-num">5</span> Voters
                  </button>
                  <div className="small mt-1">
                    <i className="fa fa-clock-o"></i>
                    <span className="ml-1">~10 min to prep</span>
                  </div>
                </div>
                <div className="col-md">
                  <button
                    disabled={this.state.adopting || maxedOut || allClaimed ? true : false}
                    onClick={() => this.adoptVoter(25, this.state.district.district_id)}
                    className="btn btn-primary btn-lg w-100 mt-1">
                      Adopt <span className="reset-num">25</span> Voters
                  </button>
                  <div className="small mt-1">
                    <i className="fa fa-clock-o"></i>
                    <span className="ml-1">~40 min to prep</span>
                  </div>
                </div>
              </div>
              { maxedOut && (
                <div className="mt-4 alert alert-info pr-4 pl-4">
                  <p>You’ve adopted the maximum number of voters ({process.env.REACT_APP_QUAL_NUM}). Fantastic! To become a super-volunteer so you can adopt more, please <a href="mailto:help@votefwd.org?subject=Please approve me as a super-volunteer!&body=Hello! Please approve me to adopt more than 100 voters on Vote Forward. (Letter writer: replace this text with a short message to the admins and if you can, attach a photo of some of your completed letters)." target="_blank" rel="noopener noreferrer">email help@votefwd.org</a> to request approval.</p>
                </div>
              )}
              { allClaimed && (
                <div className="mt-4 alert alert-warning pr-4 pl-4">
                  <p>
                    All targeted {this.props.currentDistrict.district_id} voters have been adopted! Please choose a different district.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
