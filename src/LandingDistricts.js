// src/LandingDistricts.js

import React, { Component } from 'react';
import axios from 'axios';

class DistrictItem extends Component {
  render() {
    return (
      <div className="col-3 display-4 text-primary">
        {this.props.district.district_id}
      </div>
    );
  }
}

export class LandingDistricts extends Component {
  constructor(props) {
    super(props);

    this.getDistricts = this.getDistricts.bind(this);
    this.state = { districts: [] };
  }

  getDistricts() {
    axios({
      headers: {
        Authorization: 'Bearer '.concat(localStorage.getItem('access_token'))
      },
      method: 'GET',
      url: `${process.env.REACT_APP_API_URL}/get-districts`
    })
      .then(res => {
        this.setState({ districts: res.data });
      })
      .catch(err => {
        console.error(err);
      });
  }

  componentWillMount() {
    this.getDistricts();
  }

  render() {
    return (
      <div className="container">
        <div className="row pt-5 text-center">
          <div className="col-12">
            <h3 className="mb-5">Available Districts</h3>
          </div>
          {this.state.districts.map(district => (
            <DistrictItem key={district.id} district={district} />
          ))}
        </div>
      </div>
    );
  }
}
