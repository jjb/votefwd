// src/AdoptVoter.js

import React, { Component } from 'react';
import axios from 'axios';
import loading from './loading.svg';

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
        this.props.handleAdoptedVoter(res.data.voters);
        this.setState({adopting: false});
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
          onClick={() => this.adoptVoter(5, this.state.district.district_id)}
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
              <h3>You’re Helping Flip {this.state.district.district_id} Blue <button className="btn btn-link" onClick={this.props.toggleDistrictPicker}>Switch District</button></h3>
              <p className="u-highlight mb-3">
                {this.state.district.description}
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
