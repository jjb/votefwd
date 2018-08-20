// src/AdoptVoter.js

import React, { Component } from 'react';
import axios from 'axios';
import { DistrictPicker } from './DistrictPicker';
import loading from './loading.svg';

export class AdoptVoter extends Component {
  constructor(props) {
    super(props);

    this.adoptVoter = this.adoptVoter.bind(this);
    this.lookupDistrict= this.lookupDistrict.bind(this);
    this.toggleDistrictPicker = this.toggleDistrictPicker.bind(this);
    this.state = { adopting: false, district: '', pickingDistrict: false};
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

  toggleDistrictPicker() {
    let districtPickerState = this.state.pickingDistrict
    this.setState({pickingDistrict: !districtPickerState})
  }

  lookupDistrict(districtid) {
    axios({
      method: 'GET',
      headers: {Authorization: 'Bearer '.concat(localStorage.getItem('access_token'))},
      url: `${process.env.REACT_APP_API_URL}/lookup-district`,
      params: {district_id: districtid.toString()}
      })
      .then(res => {
        this.setState({ district: res.data[0]});
      })
      .catch(err => {
        console.error(err);
    })
  }

  componentWillReceiveProps() {
    if (this.props.district) {
      this.lookupDistrict(this.props.district);
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
    } else if (!this.props.enoughVoters) {
      content = (
        <div>
          <p className="text-danger">
            All targeted voters have been adopted! We’re loading more data, so please check back soon.
          </p>
          <button
            disabled={true}
            className="btn btn-secondary btn-lg w-100">
              Adopt <span className="reset-num">5</span> Voters
          </button>
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
              <h1>Help Flip {this.props.district} Blue</h1>
              <button onClick={this.toggleDistrictPicker}>
                Change Districts
              </button>
              { this.state.pickingDistrict && <DistrictPicker/>}
              <p className="u-highlight mb-3">
                {this.state.district.description}
              </p>
              {this.state.pickingDistrict && <div>hi</div>}
              <p className="mb-3">
                <span className="small">Return address:</span>
                <br />Your first name & last initial
                <br />2870 Peachtree Road, #172
                <br />Atlanta, GA 30305
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
