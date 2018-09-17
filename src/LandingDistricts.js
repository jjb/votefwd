// src/LandingDistricts.js

import React, { Component } from 'react';
import axios from 'axios';

class DistrictItem extends Component {
  render() {
    return (
      <div className="d-flex col-sm-12 col-md-4 col-lg-3 p-3">
        <div className="bg-light border rounded">
          <div className="bg-white pl-3 pr-3 pt-2 pb-2 rounded">
            <h3>{this.props.district.state}</h3>
            <h5 className="headline">
              <a href={'/district/' + this.props.district.district_id} className="text-primary">
                {this.props.district.district_id}
              </a>
            </h5>
          </div>
          <div className="small p-3">
            {this.props.district.description}
          </div>
        </div>
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
      <div className="container pt-1 pb-5 mb-5">
        {this.props.showNav && (
          <div className="row">
            <div className="col-12 mb-3">
              <a href="/">
                <i className="fa fa-arrow-left"></i>
                <span className="pl-2">Back to home</span>
              </a>
            </div>
          </div>
        )}
        <h1
          id="target-districts"
          className="pt-3 mb-4 text-center"
        >
          Target Districts
        </h1>
        <div className="row">
          {this.state.districts.map(district => (
            <DistrictItem key={district.id} district={district} />
          ))}
        </div>
      </div>
    );
  }
}
