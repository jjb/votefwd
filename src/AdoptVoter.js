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
              <p className="mt-4 mb-3 small">
                Voters you adopt won‘t be assigned to anyone else, so by adopting them, you’re committing to send the letters.
              </p>
              <div className="row">
                <div className="col-md">
                  <button
                    disabled={this.state.adopting ? true : false}
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
                    disabled={this.state.adopting ? true : false}
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
            </div>
          </div>
        </div>
      </div>
    )
  }
}
